const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'arjunparadkar', // Use your system user
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'homefax',
  password: process.env.DB_PASSWORD || '', // Empty password for local development
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// API Routes

// Get all properties (for search)
app.get('/api/properties', async (req, res) => {
  try {
    const { search, limit = 10, owner_id } = req.query;
    
    let query = 'SELECT p.*, u.name as owner_name FROM properties p LEFT JOIN users u ON p.owner_id = u.id WHERE p.status = $1';
    let params = ['active'];
    
    if (owner_id) {
      query += ' AND p.owner_id = $' + (params.length + 1);
      params.push(owner_id);
    }
    
    if (search) {
      query += ' AND (p.address ILIKE $' + (params.length + 1) + ' OR p.registration_number ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY p.address LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, u.name as owner_name, u.email as owner_email FROM properties p LEFT JOIN users u ON p.owner_id = u.id WHERE p.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comprehensive property data (for detailed property page)
app.get('/api/properties/:id/comprehensive', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic property info
    const propertyResult = await pool.query(`
      SELECT p.*, u.name as owner_name, u.email as owner_email
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult.rows[0];

    // Get property history
    const historyResult = await pool.query(`
      SELECT * FROM property_history 
      WHERE property_id = $1 
      ORDER BY date_performed DESC
    `, [id]);

    // Get ongoing tasks
    const tasksResult = await pool.query(`
      SELECT ot.*, u.name as contractor_name
      FROM ongoing_tasks ot
      LEFT JOIN users u ON ot.contractor_id = u.id
      WHERE ot.property_id = $1 
      ORDER BY ot.created_at DESC
    `, [id]);

    // Get parts inventory
    const partsResult = await pool.query(`
      SELECT * FROM parts_inventory 
      WHERE property_id = $1 
      ORDER BY part_type, part_name
    `, [id]);

    // Get maintenance checklist
    const maintenanceResult = await pool.query(`
      SELECT * FROM maintenance_checklist 
      WHERE property_id = $1 
      ORDER BY next_due ASC
    `, [id]);

    // Get 3D models
    const modelsResult = await pool.query(`
      SELECT pm.*, u.name as created_by_name
      FROM property_3d_models pm
      LEFT JOIN users u ON pm.created_by = u.id
      WHERE pm.property_id = $1 
      ORDER BY pm.created_at DESC
    `, [id]);

    // Get active projects with updates
    const activeProjectsResult = await pool.query(`
      SELECT p.*, u.name as contractor_name, u.company as contractor_company
      FROM projects p
      LEFT JOIN users u ON p.contractor_id = u.id
      WHERE p.property_id = $1 AND p.status = 'in_progress'
      ORDER BY p.created_at DESC
    `, [id]);

    // For each active project, get its updates
    const projectsWithUpdates = await Promise.all(
      activeProjectsResult.rows.map(async (project) => {
        const updatesResult = await pool.query(`
          SELECT * FROM project_updates
          WHERE project_id = $1
          ORDER BY created_at DESC
          LIMIT 5
        `, [project.id]);
        
        return {
          ...project,
          updates: updatesResult.rows
        };
      })
    );

    // Combine all data
    const comprehensiveProperty = {
      ...property,
      history: historyResult.rows,
      ongoingTasks: tasksResult.rows,
      partsInventory: partsResult.rows,
      maintenanceChecklist: maintenanceResult.rows,
      models3D: modelsResult.rows,
      activeProjects: projectsWithUpdates
    };

    res.json(comprehensiveProperty);
  } catch (error) {
    console.error('Error fetching comprehensive property data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create access request
app.post('/api/access-requests', async (req, res) => {
  try {
    const { property_id, contractor_id, owner_id, admin_id, request_type = 'public_info_request' } = req.body;
    
    const result = await pool.query(
      'INSERT INTO access_requests (property_id, contractor_id, owner_id, admin_id, status, request_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [property_id, contractor_id, owner_id, admin_id, 'pending', request_type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating access request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get access requests for a homeowner
app.get('/api/access-requests/owner/:owner_id', async (req, res) => {
  try {
    const { owner_id } = req.params;
    const result = await pool.query(
      `SELECT ar.*, p.address as property_address, p.registration_number, u.name as requester_name, u.email as requester_email, uc.name as contractor_name
       FROM access_requests ar
       JOIN properties p ON ar.property_id = p.id
       LEFT JOIN users u ON ar.contractor_id = u.id
       LEFT JOIN users uc ON ar.contractor_id = uc.id
       WHERE ar.owner_id = $1
       ORDER BY ar.created_at DESC`,
      [owner_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching access requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update access request status
app.put('/api/access-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE access_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Access request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating access request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get projects for a property
app.get('/api/properties/:id/projects', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pr.*, u.name as contractor_name
       FROM projects pr
       LEFT JOIN users u ON pr.contractor_id = u.id
       WHERE pr.property_id = $1
       ORDER BY pr.created_at DESC`,
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upkeep logs for a property
app.get('/api/properties/:id/upkeep', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ul.*, u.name as contractor_name
       FROM upkeep_logs ul
       LEFT JOIN users u ON ul.contractor_id = u.id
       WHERE ul.property_id = $1
       ORDER BY ul.date DESC`,
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upkeep logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/project-updates - Create a project update and update the project
app.post('/api/project-updates', async (req, res) => {
  try {
    const { project_id, contractor_id, update_type, title, description, progress_percentage, files_added, parts_listed, photos_added } = req.body;
    
    // Create the update
    const updateResult = await pool.query(
      `INSERT INTO project_updates 
       (project_id, contractor_id, update_type, title, description, progress_percentage, files_added, parts_listed, photos_added)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [project_id, contractor_id, update_type, title, description, progress_percentage, files_added, parts_listed, photos_added]
    );
    
    // Update the project if progress_percentage is provided
    if (progress_percentage !== undefined && progress_percentage !== null) {
      await pool.query(
        `UPDATE projects SET percent_complete = $1 WHERE id = $2`,
        [progress_percentage, project_id]
      );
    }
    
    // Update attachments if files are provided
    if (files_added && files_added.length > 0) {
      const currentProject = await pool.query('SELECT attachments FROM projects WHERE id = $1', [project_id]);
      const existingFiles = currentProject.rows[0]?.attachments || [];
      const updatedFiles = [...existingFiles, ...files_added];
      
      await pool.query(
        `UPDATE projects SET attachments = $1 WHERE id = $2`,
        [updatedFiles, project_id]
      );
    }
    
    // Create notification for homeowner about the update
    const projectInfo = await pool.query(`
      SELECT p.property_id, p.description, u.name as contractor_name, prop.owner_id
      FROM projects p
      LEFT JOIN users u ON p.contractor_id = u.id
      LEFT JOIN properties prop ON p.property_id = prop.id
      WHERE p.id = $1
    `, [project_id]);
    
    if (projectInfo.rows[0]?.owner_id) {
      await pool.query(`
        INSERT INTO notices (user_id, property_ids, contractor_id, title, type, description, status, priority)
        VALUES ($1, $2, $3, $4, 'general', $5, 'unread', 'normal')
      `, [
        projectInfo.rows[0].owner_id,
        [projectInfo.rows[0].property_id],
        contractor_id,
        `Project update: ${title}`,
        `${projectInfo.rows[0].contractor_name} provided an update on ${projectInfo.rows[0].description}: ${description}`
      ]);
    }
    
    res.status(201).json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error creating project update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/ongoing-projects - Get all ongoing projects for admin
app.get('/api/admin/ongoing-projects', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, pr.address as property_address, pr.owner_id, u.name as contractor_name, u.company, owner.name as owner_name
       FROM projects p
       LEFT JOIN properties pr ON p.property_id = pr.id
       LEFT JOIN users u ON p.contractor_id = u.id
       LEFT JOIN users owner ON pr.owner_id = owner.id
       WHERE p.status IN ('in_progress', 'pending')
       ORDER BY p.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ongoing projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/notifications - Create public notifications
app.post('/api/admin/notifications', async (req, res) => {
  try {
    const { title, message, utility_type, is_public, priority } = req.body;
    
    const result = await pool.query(
      `INSERT INTO notices (property_ids, admin_id, type, title, message, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [null, null, 'system_alert', title, message, priority || 'normal']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/project-updates/:project_id - Get updates for a project
app.get('/api/project-updates/:project_id', async (req, res) => {
  try {
    const { project_id } = req.params;
    const result = await pool.query(
      `SELECT pu.*, u.name as contractor_name
       FROM project_updates pu
       LEFT JOIN users u ON pu.contractor_id = u.id
       WHERE pu.project_id = $1
       ORDER BY pu.created_at DESC`,
      [project_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects - Get projects with optional filters
app.get('/api/projects', async (req, res) => {
  try {
    const { contractor_id, property_id, status } = req.query;
    
    let query = `
      SELECT p.*, pr.address as property_address
      FROM projects p
      LEFT JOIN properties pr ON p.property_id = pr.id
      WHERE 1=1
    `;
    const params = [];
    
    if (contractor_id) {
      query += ` AND p.contractor_id = $${params.length + 1}`;
      params.push(contractor_id);
    }
    
    if (property_id) {
      query += ` AND p.property_id = $${params.length + 1}`;
      params.push(property_id);
    }
    
    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects - Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { property_id, contractor_id, admin_id, type, description, status, percent_complete, attachments } = req.body;
    
    const result = await pool.query(
      `INSERT INTO projects (property_id, contractor_id, admin_id, type, description, status, percent_complete, attachments, start_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [property_id, contractor_id, admin_id, type, description, status, percent_complete || 0, attachments]
    );
    
    const newProject = result.rows[0];
    
    // Create notification for homeowner
    const propertyResult = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [property_id]);
    const contractorResult = await pool.query('SELECT name, company FROM users WHERE id = $1', [contractor_id]);
    
    if (propertyResult.rows[0]?.owner_id) {
      await pool.query(`
        INSERT INTO notices (user_id, property_ids, contractor_id, title, type, description, status, priority)
        VALUES ($1, $2, $3, $4, 'general', $5, 'unread', 'high')
      `, [
        propertyResult.rows[0].owner_id,
        [property_id],
        contractor_id,
        `New ${type} project started`,
        `${contractorResult.rows[0]?.name || 'A contractor'} has started a ${type} project: ${description}`
      ]);
    }
    
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get a single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, pr.address as property_address
       FROM projects p
       LEFT JOIN properties pr ON p.property_id = pr.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, percent_complete, attachments } = req.body;
    
    const result = await pool.query(
      `UPDATE projects 
       SET description = COALESCE($1, description),
           status = COALESCE($2, status),
           percent_complete = COALESCE($3, percent_complete),
           attachments = COALESCE($4, attachments)
       WHERE id = $5 RETURNING *`,
      [description, status, percent_complete, attachments, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication Endpoints

// POST /api/auth/register - Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, adminKey, company, contractorRole } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Role-specific validation
    if (role === 'admin') {
      if (!adminKey) {
        return res.status(400).json({ error: 'Admin key required for admin registration' });
      }
      
      // Check if admin key is valid and unused
      const keyResult = await pool.query(
        'SELECT id FROM admin_keys WHERE key_value = $1 AND is_used = FALSE',
        [adminKey]
      );
      
      if (keyResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or already used admin key' });
      }
    }

    if (role === 'contractor') {
      if (!company || !contractorRole) {
        return res.status(400).json({ error: 'Company and contractor role required' });
      }
    }

    if (role === 'homeowner') {
      // Check if homeowner name exists in properties (properties with NULL owner_id)
      // Use more flexible matching - check if the name appears anywhere in the address
      const propertyResult = await pool.query(
        'SELECT id FROM properties WHERE owner_id IS NULL AND (address ILIKE $1 OR address ILIKE $2)',
        [`%${name}%`, `%${name.replace(/Mr\.\s*/i, '').replace(/Mrs\.\s*/i, '').replace(/Ms\.\s*/i, '').replace(/Dr\.\s*/i, '')}%`]
      );
      
      if (propertyResult.rows.length === 0) {
        return res.status(400).json({ error: 'Homeowner name not found in property records. Please contact support to add your property.' });
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, company, contractor_role, approved_by_admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, company, contractor_role`,
      [name, email, passwordHash, role, company || null, contractorRole || null, role === 'admin']
    );

    const user = userResult.rows[0];

    // Link properties to homeowner if applicable
    if (role === 'homeowner') {
      await pool.query(
        'UPDATE properties SET owner_id = $1 WHERE owner_id IS NULL AND (address ILIKE $2 OR address ILIKE $3)',
        [user.id, `%${name}%`, `%${name.replace(/Mr\.\s*/i, '').replace(/Mrs\.\s*/i, '').replace(/Ms\.\s*/i, '').replace(/Dr\.\s*/i, '')}%`]
      );
    }

    // Mark admin key as used if applicable
    if (role === 'admin') {
      await pool.query(
        'UPDATE admin_keys SET is_used = TRUE, used_at = NOW() WHERE key_value = $1',
        [adminKey]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        contractorRole: user.contractor_role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login - Login user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, name, email, password_hash, role, company, contractor_role, approved_by_admin FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        contractorRole: user.contractor_role,
        approvedByAdmin: user.approved_by_admin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/verify - Verify JWT token
app.get('/api/auth/verify', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user details
    const userResult = await pool.query(
      'SELECT id, name, email, role, company, contractor_role, approved_by_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        contractorRole: user.contractor_role,
        approvedByAdmin: user.approved_by_admin
      }
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /api/users - Get all users (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, approved_by_admin, company, contractor_role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin-keys - Get available admin keys (for testing)
app.get('/api/admin-keys', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT key_value, is_used, created_at, territory, created_by FROM admin_keys ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin keys:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin-keys - Create a new admin key
app.post('/api/admin-keys', async (req, res) => {
  try {
    const { key_value, territory, created_by } = req.body;
    
    const result = await pool.query(
      'INSERT INTO admin_keys (key_value, territory, created_by) VALUES ($1, $2, $3) RETURNING *',
      [key_value, territory, created_by]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating admin key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/notifications/user/:user_id - Get all notifications for a user
app.get('/api/notifications/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Get notifications for this user, including project updates
    const result = await pool.query(`
      SELECT 
        n.*,
        COALESCE(
          (SELECT p.address FROM properties p WHERE p.id = ANY(n.property_ids) LIMIT 1),
          (SELECT p.address FROM properties p WHERE p.id = ANY(n.affected_properties) LIMIT 1)
        ) as property_address
      FROM notices n
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `, [user_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/mark-read - Mark a notification as read
app.put('/api/notifications/:id/mark-read', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(`
      UPDATE notices SET status = 'read', updated_at = NOW()
      WHERE id = $1
    `, [id]);
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/properties/submission - Submit a new property for admin verification
app.post('/api/properties/submission', async (req, res) => {
  try {
    const { address, location, build_year, zoning, description, timeline_months, estimated_budget, plans_attachments, registration_number, contractor_id, status } = req.body;
    
    // Create the property in pending_verification status
    const result = await pool.query(
      `INSERT INTO properties (address, build_year, zoning, registration_number, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [address, build_year, zoning, registration_number || `PENDING-${Date.now()}`, status || 'pending_verification']
    );
    
    const newProperty = result.rows[0];
    
    // Create an access request for the contractor
    await pool.query(
      `INSERT INTO access_requests (property_id, contractor_id, request_type, status, requester_details)
       VALUES ($1, $2, 'new_property_submission', 'pending', $3)`,
      [newProperty.id, contractor_id, `New property submission: ${description}. Timeline: ${timeline_months} months. Budget: ${estimated_budget}`]
    );
    
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error submitting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HomeFax API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`HomeFax API server running on port ${port}`);
});
