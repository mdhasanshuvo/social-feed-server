# Social Feed Server

Production-ready Express + MongoDB API powering the Social Feed application.

## Live API
- Base URL: https://social-feed-server.vercel.app/api
- Health check: https://social-feed-server.vercel.app/api/health
- Swagger docs: https://social-feed-server.vercel.app/api/docs

## Core Capabilities
- Authentication:
  - Register and login with JWT.
  - Password hashing via bcrypt.
  - Protected routes via Bearer token middleware.
- Feed domain:
  - Create posts with `public` or `private` visibility.
  - Fetch feed with visibility filtering (`public` + own private posts).
  - Like/unlike posts, comments, and replies.
  - Add comments and nested replies.
- Media:
  - Upload post images via multipart endpoint.
  - Cloudinary integration for hosted media URLs.
- API quality:
  - Request validation (`express-validator`).
  - Centralized error handling.
  - Swagger endpoint documentation.
  - XSS and Mongo sanitize middleware.

## Architecture
Layered architecture used for interview clarity and maintainability:

`routes -> controllers -> services -> models`

- Routes: endpoint definition + Swagger annotations.
- Controllers: request/response orchestration.
- Services: business rules and data operations.
- Models: MongoDB schemas and persistence.

## Tech Stack
- Node.js
- Express 5
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Multer + Cloudinary
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Helmet + CORS + sanitize middleware

## Project Structure
```
api/
  index.js            Vercel serverless entrypoint
src/
  app.js              Express app setup
  server.js           Local server bootstrap
  config/             DB, Swagger, Cloudinary
  controllers/        HTTP handlers
  middleware/         Auth, upload, validate, error handling
  models/             Mongoose models
  routes/             Auth + post APIs
  services/           Business logic
  validators/         Request validation rules
  utils/              Shared utility helpers
```

## Environment Variables
Create `.env` from `.env.example`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.0nnvi.mongodb.net/socialFeedDB
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Important:
- Keep `.env` out of git.
- Use strong secrets in production.
- Ensure production values do not contain extra quotes/newlines.

## Run Locally
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - `cp .env.example .env`
3. Start in development mode:
   - `npm run dev`
4. Start in production mode:
   - `npm start`

## Scripts
- `npm run dev` - run with nodemon
- `npm start` - run server in production mode
- `npm test` - placeholder (tests not configured yet)

## API Endpoint Summary

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`

Posts:
- `GET /api/posts`
- `POST /api/posts`
- `POST /api/posts/upload-image`

Likes / Comments / Replies:
- `PATCH /api/posts/:postId/likes`
- `POST /api/posts/:postId/comments`
- `PATCH /api/posts/:postId/comments/:commentId/likes`
- `POST /api/posts/:postId/comments/:commentId/replies`
- `PATCH /api/posts/:postId/comments/:commentId/replies/:replyId/likes`

## Deployment (Vercel)
- Serverless entrypoint is configured in `api/index.js` with `vercel.json` routing.
- Configure all environment variables in Vercel Project Settings.
- Set `CLIENT_ORIGIN` to frontend URL (for example, `https://socialfeedweb.netlify.app`).
- Ensure MongoDB Atlas network access allows your deployment traffic.

## Reliability and Production Notes
- DB connection helper is serverless-safe and avoids hard process exits.
- CORS + preflight handling is explicitly covered for browser clients.
- JWT secret handling is sanitized consistently in sign/verify flow.
- Cloudinary credentials are sanitized before use to prevent upload failures.

## Known Limitations / Next Improvements
- Automated unit/integration test suite is not included yet.
- Rate limiting and brute-force protection can be added for auth endpoints.
- Structured logs and request tracing can be added for deeper observability.
