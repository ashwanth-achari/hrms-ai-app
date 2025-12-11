# HRMS-AI Application

A comprehensive Human Resource Management System powered by AI technologies, designed to streamline HR processes, enhance decision-making, and improve employee engagement through intelligent automation and data-driven insights.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [User Flow Walkthrough](#user-flow-walkthrough)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [Deployment](#deployment)

---

## 🏗️ Architecture Overview

> 📊 **For detailed sequence diagrams showing request flows, see [ARCHITECTURE_SEQUENCE_DIAGRAMS.md](./ARCHITECTURE_SEQUENCE_DIAGRAMS.md)**

The HRMS-AI application follows a **three-tier microservices architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  Port: 5173 (Vite Dev) / Production (Vercel)                │
│  - User Interface & Authentication                           │
│  - Role-based Dashboards                                    │
│  - AI-powered Recruitment Interface                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │ JWT Authentication
┌──────────────────────▼──────────────────────────────────────┐
│                 Backend API (Node.js/Express)               │
│  Port: 8200                                                  │
│  - RESTful API Endpoints                                     │
│  - JWT Authentication & Authorization                        │
│  - Business Logic & Data Validation                         │
│  - MongoDB Integration                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────▼──────────────────────────────────────┐
│              HRMS-AI Service (Python/FastAPI)              │
│  Port: 8000                                                  │
│  - Resume Parsing & OCR                                      │
│  - NLP-based Data Extraction                                │
│  - PDF Processing                                            │
│  - AI-powered Candidate Analysis                            │
└─────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    MongoDB Database                         │
│  - User Management                                           │
│  - Employee Records                                          │
│  - Candidate Data                                            │
│  - Job Postings                                              │
│  - Notifications                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

#### 1. **Frontend Layer** (`frontend/`)
- **Framework**: React 19 with Vite
- **State Management**: React Context API (AuthContext)
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **UI**: Custom components with modern styling
- **Authentication**: JWT token-based with localStorage persistence

#### 2. **Backend Layer** (`backend/`)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **Middleware**: Role-based access control (RBAC) and scope-based authorization
- **API Structure**: RESTful endpoints organized by feature

#### 3. **AI Service Layer** (`hrms-ai/`)
- **Framework**: FastAPI (Python)
- **PDF Processing**: PyMuPDF, pdfplumber, PyPDF2
- **NLP**: spaCy, NLTK
- **OCR**: pytesseract
- **Data Extraction**: Custom resume parsing algorithms

---

## 🔄 User Flow Walkthrough

### Entry Point: `frontend/src/main.jsx`

The application starts from the React entry point:

```javascript
main.jsx → App.jsx → AuthProvider → Routes
```

### Complete User Journey

#### 1. **Initial Load & Authentication**

```
User visits application
    ↓
main.jsx renders App component
    ↓
App.jsx initializes BrowserRouter & AuthProvider
    ↓
AuthContext checks localStorage for existing session
    ↓
If no token → Redirect to /login
If token exists → Load user data from localStorage
```

#### 2. **Login Flow**

```
User navigates to /login
    ↓
LoginPage component renders
    ↓
User enters credentials (email, password)
    ↓
Form submission triggers AuthContext.login()
    ↓
POST /api/auth/login to backend (http://localhost:8200)
    ↓
Backend validates credentials against MongoDB
    ↓
Backend generates JWT token
    ↓
Frontend stores token & user data in localStorage
    ↓
Redirect to /dashboard (or role-specific route)
```

#### 3. **Protected Route Access**

```
User navigates to protected route (e.g., /dashboard)
    ↓
ProtectedRoute component checks authentication
    ↓
If not authenticated → Redirect to /login
If authenticated → Render requested component
    ↓
Component makes API calls with JWT token in Authorization header
    ↓
Backend middleware validates JWT token
    ↓
Backend checks role permissions
    ↓
If authorized → Return data
If unauthorized → Return 403 Forbidden
```

#### 4. **Role-Based Dashboard Routing**

The application supports four user roles:

- **MANAGEMENT_ADMIN** → `/dashboard` (AdminDashboard)
- **SENIOR_MANAGER** → `/manager` (ManagerDashboard)
- **HR_RECRUITER** → `/recruiter` (RecruiterDashboard)
- **EMPLOYEE** → `/employee` (EmployeeDashboard)

#### 5. **AI-Powered Resume Processing Flow**

```
Recruiter selects candidate from list
    ↓
Clicks "Evaluate with OCR AI" button
    ↓
Frontend calls HRMS-AI service: GET /ocr/extract?filename=resume.pdf
    ↓
FastAPI service loads PDF from assets/resumes/
    ↓
PDF text extraction using pdfplumber
    ↓
NLP processing extracts:
    - Name, Email, Phone
    - Skills (keyword matching)
    - Experience (year pattern detection)
    - Education (degree keyword matching)
    ↓
Structured JSON response returned to frontend
    ↓
Frontend displays extracted data in evaluation panel
```

### Request Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User Action (Login, View Dashboard, etc.)
       ↓
┌──────────────────────────────────────────────┐
│         Frontend (React/Vite)                │
│  - AuthContext manages authentication        │
│  - API service (api.js) handles HTTP calls  │
│  - Components render UI                     │
└──────┬───────────────────────────────────────┘
       │
       │ 2. HTTP Request with JWT Token
       │    Authorization: Bearer <token>
       ↓
┌──────────────────────────────────────────────┐
│      Backend API (Node.js/Express)           │
│  - auth.js middleware validates JWT          │
│  - authorize.js checks role permissions      │
│  - Route handlers process business logic     │
│  - Mongoose queries MongoDB                  │
└──────┬───────────────────────────────────────┘
       │
       │ 3. For AI features: HTTP Request
       ↓
┌──────────────────────────────────────────────┐
│    HRMS-AI Service (Python/FastAPI)         │
│  - Receives PDF filename                     │
│  - Extracts text using pdfplumber            │
│  - Processes with NLP (spaCy, NLTK)          │
│  - Returns structured JSON                   │
└──────┬───────────────────────────────────────┘
       │
       │ 4. Response flows back through layers
       ↓
┌──────────────────────────────────────────────┐
│         Frontend updates UI                  │
└──────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
hrms-ai-app/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── main.jsx            # Entry point
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state management
│   │   ├── pages/
│   │   │   └── LoginPage.jsx    # Login page
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── dashboard/      # Role-specific dashboards
│   │   │   ├── layout/         # Header, Sidebar, Footer
│   │   │   └── recruitment/    # AI recruitment components
│   │   └── services/
│   │       └── api.js          # Axios instance with interceptors
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js/Express backend
│   ├── server.js               # Express server entry point
│   ├── models/                 # Mongoose schemas
│   │   ├── user.js
│   │   ├── employee.js
│   │   ├── candidate.js
│   │   ├── job.js
│   │   └── notification.js
│   ├── routes/                 # API route handlers
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── manager.js
│   │   ├── recruiter.js
│   │   ├── employee.js
│   │   ├── analytics.js
│   │   └── notifications.js
│   ├── middleware/             # Authentication & authorization
│   │   ├── auth.js             # JWT verification
│   │   ├── authorize.js        # Role-based access control
│   │   └── checkScope.js      # Scope-based access control
│   ├── scripts/                # Database seeding scripts
│   └── package.json
│
├── hrms-ai/                    # Python/FastAPI AI service
│   ├── hrms_ai/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── api.py              # Additional API endpoints (if any)
│   │   ├── extractor.py        # Resume extraction logic
│   │   ├── config.py           # Configuration settings
│   │   ├── model_load.py       # ML model loading (if any)
│   │   ├── utils/              # Utility functions
│   │   │   ├── resumeparser.py
│   │   │   ├── preprocess.py
│   │   │   └── download.py
│   │   └── assets/
│   │       └── resumes/        # Sample resume PDFs
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
└── README.md                   # This file
```

---

## ✨ Features

### Core HRMS Features
- ✅ **Employee Management**: Complete employee lifecycle management
- ✅ **Recruitment Automation**: AI-powered candidate screening
- ✅ **Performance Tracking**: Employee performance metrics and analytics
- ✅ **Leave Management**: Leave requests and approvals
- ✅ **Analytics Dashboard**: Real-time insights and reports
- ✅ **Notifications**: Real-time notification system

### AI-Powered Features
- ✅ **Resume Parsing**: Automatic extraction of candidate information from PDFs
- ✅ **OCR Processing**: Text extraction from scanned documents
- ✅ **Skill Extraction**: Automatic identification of technical skills
- ✅ **Experience Calculation**: Years of experience estimation
- ✅ **Education Detection**: Academic qualification extraction

### Security Features
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-Based Access Control (RBAC)**: Four distinct user roles
- ✅ **Scope-Based Authorization**: Department/team-level permissions
- ✅ **Password Hashing**: bcrypt for secure password storage
- ✅ **Protected Routes**: Frontend route protection

---

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **ApexCharts**: Data visualization

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### AI Service
- **Python 3.11+**: Programming language
- **FastAPI**: Modern Python web framework
- **PyMuPDF (fitz)**: PDF processing
- **pdfplumber**: PDF text extraction
- **spaCy**: NLP library
- **NLTK**: Natural language toolkit
- **pytesseract**: OCR capabilities

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Python** (3.11 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

Optional:
- **Docker** (for containerized deployment)
- **Tesseract OCR** (for advanced OCR features)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hrms-ai-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. AI Service Setup

```bash
cd ../hrms-ai

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in backend `.env` file

### 6. Database Seeding

```bash
cd backend
npm run seed
```

This will create test users:
- `admin@company.com` / `password123` (MANAGEMENT_ADMIN)
- `manager@company.com` / `password123` (SENIOR_MANAGER)
- `recruiter@company.com` / `password123` (HR_RECRUITER)
- `employee@company.com` / `password123` (EMPLOYEE)

---

## 🔐 Environment Variables

### Backend (`.env` in `backend/`)

```env
# Server Configuration
PORT=8200
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hrms-db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-db

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env` in `frontend/`)

```env
# Backend API URL
VITE_API_URL=http://localhost:8200

# AI Service URL
VITE_AI_URL=http://localhost:8000
```

### AI Service (`.env` in `hrms-ai/`)

```env
# FastAPI Configuration
DEBUG=False
API_VERSION=v1
SECRET_KEY=your_secret_key_here
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1: Start MongoDB** (if running locally)
```bash
mongod
```

**Terminal 2: Start Backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:8200
```

**Terminal 3: Start AI Service**
```bash
cd hrms-ai
# Activate virtual environment first
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn hrms_ai.main:app --reload --port 8000
# Service runs on http://localhost:8000
```

**Terminal 4: Start Frontend**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**AI Service:**
```bash
cd hrms-ai
uvicorn hrms_ai.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with a static server
```

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick API Overview

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Admin:**
- `GET /api/admin/all-employees` - Get all employees
- `GET /api/admin/analytics` - Get analytics data

**Recruiter:**
- `GET /api/recruiter/candidates` - Get candidates
- `GET /api/recruiter/jobs` - Get job postings

**AI Service:**
- `GET /health` - Health check
- `GET /ocr/extract?filename=<resume.pdf>` - Extract resume data

---

## 👥 Role-Based Access Control

The application supports four user roles with different permissions:

| Role | Description | Access Level |
|------|-------------|--------------|
| **MANAGEMENT_ADMIN** | System administrators | Full system access, all employees, analytics |
| **SENIOR_MANAGER** | Department managers | Team management, employee oversight, limited admin |
| **HR_RECRUITER** | HR recruitment team | Candidate management, job postings, AI tools |
| **EMPLOYEE** | Regular employees | Personal dashboard, leave requests, profile |

### Scope-Based Access

In addition to roles, users can have **scope** restrictions:
- `department`: Access limited to specific department
- `team`: Access limited to specific team
- `region`: Geographic access restrictions
- `businessUnit`: Business unit-level restrictions

---

## 🚢 Deployment

### Backend Deployment (Render, Railway, Heroku)

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy using:
   ```bash
   npm start
   ```

### AI Service Deployment (Render, Railway, Fly.io)

1. Create `requirements.txt` (already exists)
2. Set environment variables
3. Deploy using:
   ```bash
   uvicorn hrms_ai.main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Deployment (Vercel, Netlify)

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL
   - `VITE_AI_URL`: Your AI service URL

### Docker Deployment

See `hrms-ai/Dockerfile` for AI service containerization example.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

## 🎯 Roadmap

- [ ] Advanced AI candidate matching
- [ ] Video interview analysis
- [ ] Automated interview scheduling
- [ ] Employee performance prediction
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Integration with job boards
- [ ] Multi-language support

---

**Built with ❤️ using React, Node.js, and Python**

