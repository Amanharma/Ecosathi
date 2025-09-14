# Frontend-Backend Integration Setup Guide

## Overview
This guide will help you set up and run both the frontend and backend components of the EcoSathi application.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or accessible)
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
The `.env` file has been created with the following configuration:
```
MONGO_URI=mongodb://localhost:27017/ecosathi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 3. Start Backend Server
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend/client
npm install
```

### 2. Environment Configuration
The `.env` file has been created with:
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=EcoSathi
VITE_APP_VERSION=1.0.0
```

### 3. Start Frontend Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## Integration Features

### ✅ Authentication
- User registration and login
- JWT token-based authentication
- Role-based access control (user, admin, superadmin)

### ✅ Complaint Management
- Create complaints with image upload
- View user's own complaints
- Admin can view assigned complaints
- Superadmin can view all complaints

### ✅ API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/my` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (admin/superadmin)
- `GET /api/complaints/admin-assignments` - Get admin assignments (superadmin)

## Testing Integration

### 1. Run Integration Test
```bash
node test-integration.js
```

### 2. Manual Testing
1. Start both servers (backend on port 5000, frontend on port 5173)
2. Open `http://localhost:5173` in your browser
3. Try registering a new user
4. Login with the created user
5. Submit a complaint
6. View your complaints in the dashboard

## Configuration Details

### Port Configuration
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- API calls from frontend are configured to use port 5000

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:4173` (Vite preview)

### Authentication Flow
1. User registers/logs in through frontend
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API calls include the token in Authorization header
5. Backend validates token for protected routes

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration in `backend/server.js`

2. **Authentication Errors**
   - Verify JWT_SECRET is set in backend `.env`
   - Check token format in frontend API calls

3. **Database Connection**
   - Ensure MongoDB is running
   - Check MONGO_URI in backend `.env`

4. **Port Conflicts**
   - Backend should run on port 5000
   - Frontend should run on port 5173
   - Check for any port conflicts

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in the backend `.env` file.

## File Structure
```
Ecosathi-1/
├── backend/
│   ├── .env                 # Backend environment variables
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   └── middleware/         # Authentication middleware
├── frontend/client/
│   ├── .env                # Frontend environment variables
│   ├── src/
│   │   ├── utils/api.js    # API service
│   │   └── contexts/       # React contexts
└── test-integration.js     # Integration test script
```

## Next Steps
1. Start both servers
2. Test the integration
3. Customize the application as needed
4. Deploy to production when ready
