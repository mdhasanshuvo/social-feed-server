# Social Feed Server

Production-ready Express + MongoDB backend for the Social Feed Application.

## Project Overview
This API provides:
- JWT authentication (register/login)
- Protected feed API
- Post creation with public/private visibility
- Like/unlike for posts, comments, and replies
- Comments and replies inside post documents
- Swagger docs for all endpoints

Architecture is kept simple and interview-friendly:
- `routes` -> `controllers` -> `services` -> `models`
- central error handling
- request validation with `express-validator`

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

## Folder Structure
- `src/config` DB and Swagger config
- `src/routes` API route definitions + Swagger annotations
- `src/controllers` HTTP handlers
- `src/services` business logic
- `src/models` Mongoose schemas
- `src/middleware` auth, validation, error middleware
- `src/utils` shared helpers
- `src/validators` request validators

## Setup
1. Install dependencies:
   - `npm install`
2. Copy env values:
   - `cp .env.example .env`
3. Run dev server:
   - `npm run dev`
4. Run production mode:
   - `npm start`

## Environment Variables
Use `.env`:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_strong_secret`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_ORIGIN=http://localhost:5173`
- `API_BASE_URL=http://localhost:5000`

## API Docs
Swagger UI:
- `http://localhost:5000/api/docs`

## Main Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/posts` (protected)
- `POST /api/posts` (protected)
- `PATCH /api/posts/:postId/likes` (protected)
- `POST /api/posts/:postId/comments` (protected)
- `PATCH /api/posts/:postId/comments/:commentId/likes` (protected)
- `POST /api/posts/:postId/comments/:commentId/replies` (protected)
- `PATCH /api/posts/:postId/comments/:commentId/replies/:replyId/likes` (protected)

## Deployment (Vercel)
1. Create a Vercel project from backend repo.
2. Set build command to none and output to none (Node API project).
3. Add all env vars from `.env.example` in Vercel dashboard.
4. Ensure MongoDB Atlas allows Vercel IP access.
5. Set `CLIENT_ORIGIN` to Netlify frontend URL.

## Notes
- Never commit `.env`.
- The provided database credentials should be rotated before production use.
