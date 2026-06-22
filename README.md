# HireMind AI Job Portal

AI-powered MERN job portal with candidate, recruiter, and admin workflows.

## Tech Stack

- React, Vite, Tailwind CSS, React Router, Axios
- Node.js, Express, MongoDB, Mongoose
- JWT auth, Zod validation, Multer PDF uploads
- Groq Cloud for resume extraction, job matching, interview questions, and resume suggestions

## Features

- Candidate registration/login, resume upload, job browsing, applications, tracking, AI match scores, and resume suggestions
- Recruiter job posting, applicant review, shortlisting/rejection/hiring, listing management, and AI interview questions
- Admin user/recruiter management and analytics dashboard

## Setup

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Create environment files from the examples:

- `client/.env.example` to `client/.env`
- `server/.env.example` to `server/.env`

Set `GROQ_API_KEY` in `server/.env` to enable Phase 2 AI features. You can override the default model with `GROQ_MODEL`.

## Scripts

```bash
npm run dev
npm run client
npm run server
npm run build
npm run lint
```

The default local URLs are:

- Client: `http://localhost:5174`
- API: `http://localhost:5001/api`
- MongoDB database: `ai_job_portal`
