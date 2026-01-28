# Recruiter Views Backend

This is the backend API for the Recruiter Views platform, built with Node.js, Express, and MongoDB Atlas. It handles recruiter registration, candidate CV uploads, visit tracking, and superadmin analytics.

---

## 🚀 Features

- Recruiter registration with email uniqueness
- Candidate CV upload and deletion via Multer
- Superadmin-only recruiter data access
- Recruiter visit tracking and analytics by week/month/quarter
- MongoDB Atlas integration
- RESTful API endpoints

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- Multer (file uploads)
- dotenv (env config)
- CORS

---

## 📁 Folder Structure
backend/ ├── src/ │   └── routes/ │       ├── candidate.js │       └── trackVisits.js ├── uploads/ ├── server.js ├── .env ├── .gitignore ├── package.json ├── README.md └── test_endpoints.bat

