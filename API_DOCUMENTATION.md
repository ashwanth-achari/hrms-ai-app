# HRMS-AI API Documentation

Complete API reference for the HRMS-AI application. This document covers all endpoints across the Backend API and AI Service.

**Base URLs:**
- Backend API: `http://localhost:8200` (development) or your production URL
- AI Service: `http://localhost:8000` (development) or your production URL

---

## Table of Contents

- [Authentication](#authentication)
- [Backend API Endpoints](#backend-api-endpoints)
  - [Admin Endpoints](#admin-endpoints)
  - [Manager Endpoints](#manager-endpoints)
  - [Recruiter Endpoints](#recruiter-endpoints)
  - [Employee Endpoints](#employee-endpoints)
  - [Analytics Endpoints](#analytics-endpoints)
  - [Notification Endpoints](#notification-endpoints)
- [AI Service Endpoints](#ai-service-endpoints)
- [Error Handling](#error-handling)
- [Authentication & Authorization](#authentication--authorization)

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "✅ Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@company.com",
    "role": "MANAGEMENT_ADMIN",
    "scope": {
      "department": "Admin",
      "team": "HQ"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:8200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"password123"}'
```

---

### Logout

Logout endpoint (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Backend API Endpoints

### Health Check

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "hrms-backend"
}
```

---

## Admin Endpoints

All admin endpoints require `MANAGEMENT_ADMIN` role.

### Get All Employees

Retrieve paginated list of all employees.

**Endpoint:** `GET /api/admin/all-employees`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@company.com",
      "department": "Engineering",
      "position": "Senior Developer",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

### Get Analytics

Get system-wide analytics and statistics.

**Endpoint:** `GET /api/admin/analytics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalEmployees": 150,
    "totalDepartments": 8,
    "totalCandidates": 45,
    "openJobs": 12,
    "totalUsers": 25,
    "activeEmployees": 142,
    "onLeave": 8
  }
}
```

---

### Create Employee

Create a new employee record.

**Endpoint:** `POST /api/admin/create-employee`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "department": "Engineering",
  "position": "Frontend Developer",
  "salary": 75000,
  "hireDate": "2024-01-15"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Employee created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "department": "Engineering",
    "position": "Frontend Developer"
  }
}
```

---

### Update Employee

Update an existing employee.

**Endpoint:** `PUT /api/admin/update-employee/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "position": "Senior Frontend Developer",
  "salary": 85000
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Employee updated successfully",
  "data": { ... }
}
```

---

### Delete Employee

Delete an employee record.

**Endpoint:** `DELETE /api/admin/delete-employee/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Employee deleted successfully"
}
```

---

## Manager Endpoints

All manager endpoints require `SENIOR_MANAGER` role.

### Get Team Members

Get employees under the manager's team.

**Endpoint:** `GET /api/manager/team`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@company.com",
      "position": "Developer",
      "department": "Engineering",
      "team": "Backend"
    }
  ]
}
```

---

### Get Team Analytics

Get analytics for the manager's team.

**Endpoint:** `GET /api/manager/team-analytics`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "teamSize": 15,
    "activeMembers": 14,
    "onLeave": 1,
    "averageExperience": 4.5,
    "department": "Engineering"
  }
}
```

---

### Approve Leave Request

Approve a leave request from a team member.

**Endpoint:** `POST /api/manager/approve-leave/:requestId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved",
  "comments": "Approved. Enjoy your vacation!"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Leave request approved"
}
```

---

## Recruiter Endpoints

All recruiter endpoints require `HR_RECRUITER` role.

### Get Candidates

Get list of all candidates.

**Endpoint:** `GET /api/recruiter/candidates`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Senior Developer",
      "status": "INTERVIEW",
      "appliedDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Jobs

Get list of all job postings.

**Endpoint:** `GET /api/recruiter/jobs`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "1",
      "title": "Senior Backend Developer",
      "department": "Engineering",
      "status": "Open",
      "applications": 15,
      "postedDate": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

---

### Create Job Posting

Create a new job posting.

**Endpoint:** `POST /api/recruiter/create-job`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "description": "We are looking for an experienced frontend developer...",
  "requirements": ["React", "TypeScript", "5+ years experience"],
  "location": "Remote",
  "salaryRange": "$80,000 - $120,000"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Job posting created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Senior Frontend Developer",
    "status": "Open"
  }
}
```

---

### Update Candidate Status

Update the status of a candidate.

**Endpoint:** `PUT /api/recruiter/update-candidate/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SELECTED",
  "notes": "Strong technical skills, good cultural fit"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Candidate status updated"
}
```

---

## Employee Endpoints

All employee endpoints require `EMPLOYEE` role or higher.

### Get Employee Profile

Get the authenticated employee's profile.

**Endpoint:** `GET /api/employee/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@company.com",
    "department": "Engineering",
    "position": "Developer",
    "hireDate": "2023-01-15",
    "salary": 75000,
    "manager": {
      "name": "Jane Manager",
      "email": "jane.manager@company.com"
    }
  }
}
```

---

### Request Leave

Submit a leave request.

**Endpoint:** `POST /api/employee/request-leave`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "startDate": "2024-02-15",
  "endDate": "2024-02-20",
  "type": "vacation",
  "reason": "Family vacation"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Leave request submitted",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "startDate": "2024-02-15",
    "endDate": "2024-02-20",
    "status": "pending"
  }
}
```

---

### Get Leave History

Get the employee's leave request history.

**Endpoint:** `GET /api/employee/leave-history`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "startDate": "2024-01-10",
      "endDate": "2024-01-12",
      "type": "sick",
      "status": "approved",
      "days": 3
    }
  ]
}
```

---

## Analytics Endpoints

### Get Dashboard Analytics

Get analytics data for dashboard (role-based).

**Endpoint:** `GET /api/analytics/dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 142,
    "onLeave": 8,
    "newHires": 5,
    "departments": [
      {
        "name": "Engineering",
        "count": 45
      }
    ]
  }
}
```

---

## Notification Endpoints

### Get Notifications

Get user's notifications.

**Endpoint:** `GET /api/notifications`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `unread` (optional): Filter unread notifications (true/false)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Leave Request Approved",
      "message": "Your leave request for Feb 15-20 has been approved",
      "type": "leave",
      "read": false,
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ]
}
```

---

### Mark Notification as Read

Mark a notification as read.

**Endpoint:** `PUT /api/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

## AI Service Endpoints

### Health Check

Check if the AI service is running.

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "hrms-ai"
}
```

---

### Extract Resume Data

Extract structured data from a resume PDF using OCR and NLP.

**Endpoint:** `GET /ocr/extract`

**Query Parameters:**
- `filename` (required): Name of the PDF file in `assets/resumes/` directory

**Example:**
```
GET /ocr/extract?filename=Mohan_raja_ram.pdf
```

**Response (200 OK):**
```json
{
  "full_name": "Mohan Raja Ram",
  "email": "mohan@example.com",
  "phone": "+1 234 567 8900",
  "skills": [
    "python",
    "javascript",
    "react",
    "node.js",
    "mongodb"
  ],
  "total_experience_years": 3.5,
  "education": [
    {
      "line": "B.Tech in Computer Science, XYZ University, 2020"
    },
    {
      "line": "M.Tech in Software Engineering, ABC University, 2022"
    }
  ],
  "raw_text": "Full extracted text from PDF..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid filename or missing .pdf extension
- `404 Not Found`: Resume file not found in assets/resumes folder
- `500 Internal Server Error`: Parsing failed

**Example Request:**
```bash
curl "http://localhost:8000/ocr/extract?filename=Mohan_raja_ram.pdf"
```

**Supported PDF Files:**
The service looks for PDFs in `hrms-ai/hrms_ai/assets/resumes/` directory. Currently available:
- `Mohan_raja_ram.pdf`
- `john_doe.pdf`
- `Ashwanth_achari.pdf`

---

## Error Handling

All API endpoints follow a consistent error response format:

### Error Response Format

```json
{
  "error": "Error message description",
  "status": "error"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

### Common Error Scenarios

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "No token"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden: insufficient role",
  "message": "You don't have permission to access this resource"
}
```

**400 Bad Request:**
```json
{
  "error": "Email and password required"
}
```

**404 Not Found:**
```json
{
  "error": "Route not found"
}
```

---

## Authentication & Authorization

### JWT Token Structure

The JWT token contains the following payload:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "admin@company.com",
  "role": "MANAGEMENT_ADMIN",
  "scope": {
    "department": "Admin",
    "team": "HQ"
  },
  "iat": 1705315200,
  "exp": 1705401600
}
```

### Token Expiration

- Default expiration: **24 hours**
- Token is stored in `localStorage` on the frontend
- On expiration, user must login again

### Role Hierarchy

1. **MANAGEMENT_ADMIN** - Full system access
2. **SENIOR_MANAGER** - Team and department management
3. **HR_RECRUITER** - Recruitment and candidate management
4. **EMPLOYEE** - Personal dashboard and profile

### Scope-Based Access

In addition to roles, users can have scope restrictions:
- `department`: Access limited to specific department
- `team`: Access limited to specific team
- `region`: Geographic restrictions
- `businessUnit`: Business unit restrictions

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

---

## CORS Configuration

The backend API is configured to accept requests from:
- `http://localhost:5173` (development)
- Your production frontend URL (set via `CLIENT_URL` environment variable)

The AI service accepts requests from:
- `http://localhost:5173`
- `https://hrms-ai-app.vercel.app` (production)

---

## Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"password123"}'
```

**Get Employees (with token):**
```bash
curl http://localhost:8200/api/admin/all-employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the collection (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:8200`
   - `token`: Your JWT token
3. Use the `Authorization` tab to set Bearer token for protected endpoints

---

## API Versioning

Currently, the API does not use versioning. Future versions may include:
- `/api/v1/...`
- `/api/v2/...`

---

## Webhooks

Webhooks are not currently implemented. Future features may include:
- Candidate status change notifications
- Leave request approvals
- Employee onboarding events

---

## Support

For API-related issues or questions:
1. Check this documentation
2. Review error messages in responses
3. Check server logs
4. Open an issue on the repository

---

**Last Updated:** January 2024
**API Version:** 1.0.0

