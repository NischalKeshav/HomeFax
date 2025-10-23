
# HomeFax - CarFax for Homes

**Know your home. Know your worth.**

HomeFax is a comprehensive property intelligence platform that provides detailed history, renovation records, and neighborhood insights to help homeowners, buyers, and contractors make informed decisions.

## 🏠 Features

### For Homeowners
- **Property Management**: Track renovations, maintenance, and property history
- **Secure File Uploads**: Upload photos, receipts, permits with encryption
- **Audit Logging**: Complete transparency with timestamped changes
- **Neighborhood Insights**: Stay informed about local construction and events

### For Buyers
- **Property History**: Access verified renovation records and inspection reports
- **Neighborhood Data**: Real-time updates on construction, traffic, and school zones
- **Transparency**: Make informed decisions with complete property intelligence

### For Contractors
- **Project Portfolio**: Showcase your work with verified project submissions
- **File Management**: Upload 3D models, blueprints, and parts lists
- **Client Connection**: Connect with homeowners who need quality renovations

### For Admins
- **Platform Management**: Approve reports, verify properties, and manage users
- **Community Updates**: Send notifications to neighborhoods
- **Analytics Dashboard**: Track platform growth and user engagement

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for responsive, modern UI
- **React Router** for navigation
- **Recharts** for data visualization
- **Mapbox GL** for interactive maps
- **Firebase Auth** for authentication
- **Lucide React** for icons

### Backend
- **FastAPI** for high-performance API
- **SQLAlchemy** for database ORM
- **PostgreSQL** for production database
- **SQLite** for development
- **Pydantic** for data validation
- **JWT** for authentication
- **Alembic** for database migrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL (for production)

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Run database migrations
python -m alembic upgrade head

# Seed sample data (optional)
python seed_data.py

# Start development server
python main.py
```

The API will be available at `http://localhost:8000`

### Environment Configuration

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
VITE_FIREBASE_API_KEY=your-firebase-key
```

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./homefax.db
SECRET_KEY=your-secret-key
FIREBASE_PROJECT_ID=your-firebase-project
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 📱 Demo Accounts

For testing purposes, use these demo accounts:

- **Homeowner**: `homeowner@example.com` / `password`
- **Contractor**: `contractor@example.com` / `password`
- **Buyer**: `buyer@example.com` / `password`
- **Admin**: `admin@example.com` / `password`

## 🏗 Project Structure

```
HomeFax/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # FastAPI backend
│   ├── routes/           # API route handlers
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # Database configuration
│   ├── utils/            # Utility functions
│   └── requirements.txt  # Backend dependencies
└── README.md
```

## 🔐 Role-Based Access Control

The application implements comprehensive role-based access control:

- **Homeowner**: Full access to owned properties, can claim homes, upload documents
- **Buyer**: Read-only access to property information, can request reports
- **Contractor**: Access to assigned properties, can submit project files
- **Admin**: Full platform access, can approve reports and manage users

## 🗺 Map Integration

- **Mapbox GL JS** for interactive property maps
- **Property Markers** with verification status
- **Community Updates** overlay for neighborhood events
- **Responsive Design** for mobile and desktop

## 📊 Data Visualization

- **Recharts** for interactive charts and graphs
- **Property Value Trends** over time
- **Renovation Activity** tracking
- **User Growth** analytics
- **Revenue Tracking** for contractors

## 🔒 Security Features

- **JWT Authentication** with role-based permissions
- **Encrypted File Uploads** for sensitive documents
- **Audit Logging** for all changes
- **Input Validation** with Pydantic
- **CORS Protection** for API endpoints

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables
# Deploy with requirements.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CarFax** for the inspiration
- **React** and **FastAPI** communities
- **Tailwind CSS** for beautiful styling
- **Mapbox** for mapping capabilities

---

**Built with ❤️ for transparent property intelligence**
