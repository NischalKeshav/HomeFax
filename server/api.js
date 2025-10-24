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
    const { search, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM properties WHERE status = $1';
    let params = ['active'];
    
    if (search) {
      query += ' AND (address ILIKE $2 OR registration_number ILIKE $2)';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY address LIMIT $' + (params.length + 1);
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
      `SELECT ar.*, p.address, p.registration_number, u.name as requester_name, u.email as requester_email
       FROM access_requests ar
       JOIN properties p ON ar.property_id = p.id
       LEFT JOIN users u ON ar.contractor_id = u.id
       WHERE ar.owner_id = $1 AND ar.status = 'pending'
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
      // Check if homeowner name exists in properties
      const propertyResult = await pool.query(
        'SELECT properties.id FROM properties JOIN users ON properties.owner_id = users.id WHERE users.name ILIKE $1',
        [`%${name}%`]
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

// GET /api/admin-keys - Get available admin keys (for testing)
app.get('/api/admin-keys', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT key_value, is_used, created_at FROM admin_keys ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin keys:', error);
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
