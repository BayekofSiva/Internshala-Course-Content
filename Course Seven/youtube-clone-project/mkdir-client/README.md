# YouClone – A YouTube‑style MERN App

> Educational project inspired by YouTube. Fewer ads, more code.

## Overview
YouClone is a full‑stack app that lets users register/login, create channels, upload video metadata, browse & search videos, and chat in the comments. It uses a React + Vite front‑end and a Node/Express + MongoDB back‑end with JWT auth.

Repo path: `Course Seven/youtube-clone-project`  
- Front‑end: `mkdir-client`  
- Back‑end: `mkdir-server`

## Features
- 🔐 Auth: Register, login, persistent sessions (JWT in `Authorization: Bearer <token>`).
- 👤 Channels: Create/delete your channel; list your channels.
- 🎬 Videos: Upload metadata (title, URLs, duration, category), edit/delete your own, list & search by query/category, view single video.
- 💬 Comments: Add, edit, delete your own; list by video.
- 🌗 Theme: Light/dark toggle stored in localStorage.
- 🔎 UI niceties: Filter bar categories, search bar in header, responsive layout.
- 🧭 Protected routes: Pages behind auth are guarded on the client.

## Tech Stack
- **Client**: React + Vite, React Router, Axios, Font Awesome.
- **Server**: Node.js, Express, Mongoose, JSON Web Tokens, bcryptjs, CORS, dotenv.
- **DB**: MongoDB.

## Project Structure
```
youtube-clone-project/
├── mkdir-client/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Header, Sidebar, FilterBar, VideoCard, CommentSection, etc.
│   │   ├── context/       # AuthContext, ThemeContext
│   │   └── pages/         # Home, VideoPlayer, ChannelPage, CreateChannel, Login, Register
│   ├── package.json       # dev/build scripts
│   └── vite.config.js     # proxy for /api → localhost:5000 (dev)
└── mkdir-server/          # Node/Express API
    ├── middleware/        # auth.js (JWT)
    ├── models/            # User, Channel, Video, Comment
    ├── routes/            # auth, channel, videos, comments
    ├── server.js          # app bootstrap & Mongo connect
    ├── seed.js            # (optional) seed helper
    └── package.json
```

## Getting Started (Local Dev)

### 1) Back‑end
```bash
cd "Course Seven/youtube-clone-project/mkdir-server"
npm install
# .env (create this file)
# MONGODB_URI=mongodb://localhost:27017/youtube-clone
# JWT_SECRET=please-change-me
# PORT=5000

npm run dev   # or: npm start
```
Server runs at `http://localhost:5000`.

### 2) Front‑end
```bash
cd "../mkdir-client"
npm install
npm run dev
```
Vite dev server runs at `http://localhost:5173` and proxies `/api` to `http://localhost:5000` (see `vite.config.js`).

## Environment Variables (Server)
- `MONGODB_URI` – your Mongo connection string.
- `JWT_SECRET` – secret used to sign JWTs.
- `PORT` – optional (defaults to 5000).

## API (Selected Endpoints)

### Auth – `/api/auth`
- `POST /register` → `{ token, user }` (unique username/email; bcrypt password)  
- `POST /login` → `{ token, user }`  
- `GET /user` → `{ user }` (requires `Authorization: Bearer <token>`)

### Channel – `/api/channel`
- `POST /` (auth) → create channel `{ channelName, description?, channelBanner? }` owner = current user.
- `GET /my` (auth) → channels owned by current user.
- `GET /:id` → channel by id incl. videos.
- `DELETE /:id` (auth, owner only) → deletes channel and its videos.

### Videos – `/api/videos`
- `GET /` → list videos with optional `?search=<q>&category=<name>` (sorted by uploadDate desc).  
- `GET /:id` → single video with channel & uploader populated.  
- `POST /` (auth, owner of channel) → create video `{ channelId, title, videoUrl, thumbnailUrl, description?, category?, duration? }`.  
- `PUT /:id` (auth, uploader only) → update allowed fields.  
- `DELETE /:id` (auth, uploader only) → removes video + associated comments.

### Comments – `/api/comments`
- `GET /?videoId=<id>` → list comments (chronological).  
- `POST /` (auth) → add comment `{ videoId, text }`.  
- `PUT /:id` (auth, owner only) → edit comment text.  
- `DELETE /:id` (auth, owner only) → delete comment.

## Data Models (Mongoose)
- **User**: `username*`, `email*`, `password*`, `avatar`, `channels[]` (refs Channel)
- **Channel**: `channelName*`, `owner*` (ref User), `description`, `channelBanner`, `subscribers`, `videos[]` (refs Video)
- **Video**: `title*`, `videoUrl*`, `thumbnailUrl*`, `description`, `channel*`, `uploader*`, `category`, `views`, `likes`, `dislikes`, `duration`, `uploadDate`
- **Comment**: `video*`, `user*`, `text*`, `timestamp`

\* required

## Deployment (Vercel + Render)
- **Back‑end on Render**: deploy `mkdir-server`, set env vars (`MONGODB_URI`, `JWT_SECRET`, `PORT` if needed). Confirm the app exposes `/api` routes (e.g., `https://your-api.onrender.com/api`).
- **Front‑end on Vercel**:
  - Because dev uses a Vite proxy, set a production base URL for Axios.
  - Quick option: at app init, set
    ```js
    import axios from "axios";
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
    ```
  - Then in Vercel, set `VITE_API_URL=https://your-api.onrender.com`.
  - Alternatively, configure Vercel rewrites from `/api/*` → your Render API.

## Notes & Limitations
- Video **files** are not stored; the app stores **metadata** (`videoUrl`, `thumbnailUrl`). Use S3/Cloudinary/Add storage if you want real uploads.
- Basic auth only (no refresh tokens, no OAuth).
- No rate limiting or production logging.

## Roadmap / Ideas
- Real video uploads to S3/Cloudinary with signed URLs.
- Subscriptions, likes, watch history, playlists.
- Pagination & infinite scroll.
- Robust validation (zod/joi), request rate limiting, and better error handling.
- E2E tests (Playwright) & API tests (Supertest).
- Docker Compose for one‑command local setup.

## Scripts
**Client**
```bash
npm run dev       # start Vite dev server
npm run build     # build for production
npm run preview   # preview production build
```
**Server**
```bash
npm run dev       # nodemon
npm start         # node server.js
```

---

Made with ❤ and a healthy dislike of autoplay ads.