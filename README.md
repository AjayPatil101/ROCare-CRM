# ROCare-CRM
Customer management and automated service reminder application for RO businesses.
# RO Service Management — MERN Stack Application

A full-stack conversion of the original static HTML/CSS/JS dashboard into a
production-ready **MongoDB + Express + React + Node.js** application, for
managing RO (water purifier) customers, service visits, reminders and
payments.

## Tech Stack

- **Frontend:** React 18 (functional components + Hooks), React Router v6, Axios, Vite
- **Backend:** Node.js, Express.js (MVC architecture)
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT access tokens, bcrypt password hashing, JWT-based reset tokens
- **File uploads:** Multer (customer photos, user avatars)
- **Email:** Nodemailer (password reset, service reminders, contact notifications)
- **API docs:** Swagger UI at `/api-docs`

## Project Structure

```
ro-service-app/
├── server/                  # Express REST API
│   ├── config/               # db.js, swagger.js
│   ├── controllers/          # business logic per resource
│   ├── models/                # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── middleware/          # auth, error handling, validation, uploads
│   ├── services/              # emailService.js (Nodemailer)
│   ├── utils/                   # generateToken, apiFeatures, seedData
│   ├── uploads/               # uploaded images (gitignored contents)
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, Topbar, MobileNav, Layout
│   │   │   └── common/      # Loader, ErrorMessage, Pagination, ProtectedRoute...
│   │   ├── pages/              # Dashboard, Customers, Services, Payments, Admin/...
│   │   ├── context/           # AuthContext
│   │   ├── hooks/              # useAuth, useDebounce
│   │   ├── services/          # api.js (Axios) + one service file per resource
│   │   ├── utils/               # formatting helpers
│   │   ├── styles/             # index.css (ported design system)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Features Implemented

- **Auth:** Register, Login, Forgot Password (emailed reset link), Reset Password, Change Password, protected/role-based routes (admin vs staff)
- **Customers:** CRUD, photo upload, search, pagination, detail view with service/payment history
- **Services:** Log visits, auto-computes next due date (+3 months), auto-creates a pending payment
- **Reminders:** Due Today / This Week / This Month / All, filtered server-side by `nextDueDate`
- **Payments:** List with status filter, mark-as-paid, pending total
- **Reports:** Aggregated stats + 30-day earnings chart (MongoDB aggregation pipeline)
- **Admin Panel:** Overview stats, user management (role/active toggle/delete), contact message inbox
- **Contact form:** Public submission endpoint, stored in MongoDB, optional email notification
- **Cross-cutting:** centralized error handler, express-validator input validation, rate limiting, Helmet security headers, Mongo sanitize (NoSQL injection protection), Swagger API docs at `/api-docs`

---

## 1. Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string
- (Optional) An SMTP account for real email sending (Gmail App Password, SendGrid, Mailgun, etc.)

### Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, JWT_RESET_SECRET, SMTP_* values
npm run seed      # optional: populates demo data (admin@roservice.com / password123)
npm run dev        # starts the API on http://localhost:5000
```

### Frontend setup

```bash
cd client
npm install
cp .env.example .env    # VITE_API_URL=/api is fine for local dev (Vite proxy handles it)
npm run dev               # starts the app on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Register the first account —
it automatically becomes an **admin**.

### Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Frontend origin, used for CORS and reset-password links |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Access token secret & lifetime |
| `JWT_RESET_SECRET` / `JWT_RESET_EXPIRES_IN` | Password-reset token secret & lifetime |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Nodemailer transport |
| `EMAIL_FROM` | "From" header on outgoing emails |
| `MAX_FILE_UPLOAD_MB` / `UPLOAD_PATH` | Multer limits |
| `RATE_LIMIT_WINDOW_MIN` / `RATE_LIMIT_MAX_REQUESTS` | API rate limiting |

See `server/.env.example` and `client/.env.example` for full templates.

---

## 2. API Overview

Full interactive documentation is served at **`GET /api-docs`** once the
server is running (Swagger UI). Summary of the main routes:

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Get JWT |
| GET | `/api/auth/me` | Private | Current user profile |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password/:token` | Public | Reset password |
| GET/POST | `/api/customers` | Private | List / create customers (search, pagination) |
| GET/PUT/DELETE | `/api/customers/:id` | Private | Customer detail / update / delete |
| GET | `/api/customers/reminders/:range` | Private | `today` \| `week` \| `month` \| `all` |
| GET/POST | `/api/services` | Private | List / log services |
| PUT/DELETE | `/api/services/:id` | Private | Update / delete a service |
| GET/POST | `/api/payments` | Private | List / create payments |
| PUT/DELETE | `/api/payments/:id` | Private | Update (mark paid) / delete |
| GET | `/api/dashboard/stats` | Private | KPI cards + reminder donut data |
| GET | `/api/dashboard/earnings-report` | Private | 30-day earnings series |
| POST | `/api/contact` | Public | Submit contact form |
| GET/PUT/DELETE | `/api/contact/:id` | Admin | Manage messages |
| GET | `/api/admin/overview` | Admin | Admin dashboard stats |
| GET/PUT/DELETE | `/api/admin/users/:id` | Admin | User management |

All private routes require `Authorization: Bearer <token>`.

---

## 3. Deployment Guide

### Backend (Node/Express) — e.g. Render, Railway, or a VPS

1. Push the `server/` folder to your host (or the whole repo with a build root of `server`).
2. Set environment variables from `.env.example` in your host's dashboard (never commit `.env`).
3. Use a managed MongoDB instance (MongoDB Atlas free tier works well) and set `MONGO_URI` accordingly.
4. Start command: `npm install && npm start`.
5. Ensure the `uploads/` directory is writable, or switch `middleware/upload.js` to a cloud storage provider (S3, Cloudinary) for production — local disk storage doesn't persist across most container redeploys.
6. Point `CLIENT_URL` at your deployed frontend domain so CORS and reset-password links work.

### Frontend (React/Vite) — e.g. Vercel, Netlify, or any static host

1. Set `VITE_API_URL` to your deployed backend's public URL (e.g. `https://api.yourdomain.com/api`).
2. Build command: `npm install && npm run build` — outputs static files to `client/dist`.
3. Deploy the `dist/` folder as a static site.
4. Configure a SPA rewrite rule (`/* -> /index.html`) so React Router's client-side routes work on refresh.

### Production checklist

- [ ] Strong, unique `JWT_SECRET` / `JWT_RESET_SECRET`
- [ ] `NODE_ENV=production` on the backend
- [ ] HTTPS on both frontend and backend
- [ ] MongoDB Atlas IP allowlist / VPC peering configured
- [ ] Real SMTP credentials (a transactional email provider, not personal Gmail, for volume)
- [ ] File uploads moved to object storage (S3/Cloudinary) if deploying to an ephemeral filesystem
- [ ] Rate limiting values tuned for expected traffic

---

## 4. Default Seed Login

After running `npm run seed` in `server/`:

- **Email:** `admin@roservice.com`
- **Password:** `password123`

Change this password immediately in a real deployment.
