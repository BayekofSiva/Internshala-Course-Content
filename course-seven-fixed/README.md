# YouTube Clone Project (Refactored)

This repository contains a simplified YouTube‑style web application built
with **React** (frontend) and **Express/MongoDB** (backend).  The project
demonstrates user authentication, video browsing, uploading and playback.

## What Was Changed

The original code base bundled styles directly inside JavaScript
components and used Framer Motion for some hover animations.  To make the
interface easier to maintain and customise, the following refactor and
bug fixes were applied:

1. **Styling moved to CSS** – All inline style objects were replaced with
   reusable CSS classes defined under `client/src/styles/`.  The theme still
   uses CSS variables such as `--bg`, `--surface`, `--text`,
   `--primary`, and `--muted` provided by the existing `ThemeContext`.  
   Cards, buttons and forms now have hover effects and subtle `fadeInUp`
   animations defined purely in CSS (see `global.css` and `register.css`).
2. **Animations inspired by overtake.gg** – Buttons and cards lift
   slightly on hover and cast a gentle shadow.  Components fade in and slide
   upward when they appear.  These transitions are implemented using
   standard CSS `transition` and `@keyframes` rules rather than JavaScript.
3. **Registration bug fixed** – The server previously imported the
   `User` model using the wrong case (`../models/user.js`), which causes a
   *module not found* error on case‑sensitive file systems.  The import has
   been corrected to `../models/User.js` and the controller updated to
   return consistent JSON error messages.  This resolves the issue where
   registration always failed with “registration failed” or “server error”.
4. **Sample video placeholders** – In the absence of a real video API,
   the `HomePage` component falls back to a dummy video card when an
   error occurs fetching videos.  Clicking these cards will still navigate
   to the player page.
5. **Documentation updated** – This `README.md` explains how to run the
   project and highlights the changes.

## Running the Project

### Backend

```bash
cd server
npm install        # install backend dependencies
npm run dev        # run the Express server with nodemon
```

The server expects a MongoDB connection string in a `.env` file, e.g.:

```env
MONGO_URI=mongodb://127.0.0.1:27017/youtube-clone
SESSION_SECRET=your-secret-key
```

### Frontend

```bash
cd client
npm install        # install frontend dependencies
npm run dev        # start Vite development server
```

Open your browser at `http://localhost:5173` to view the app.

## Dependencies

After checking out the repository in VS Code, ensure you run `npm install`
inside both the `client` and `server` directories.  The major packages used
are summarised below:

### Client

| Package             | Purpose                                       |
|---------------------|-----------------------------------------------|
| `react` and `react-dom` | Core UI library                            |
| `react-router-dom`  | Client‑side routing                           |
| `axios`             | HTTP client for API requests                  |
| `styled-components` | (Legacy) styled component library (not used after refactor but still installed) |
| `framer-motion`     | Animation library (may still be used by other components; the refactor removes its usage in VideoCard) |
| `vite`              | Development/build tool                        |

### Server

| Package             | Purpose                                       |
|---------------------|-----------------------------------------------|
| `express`           | HTTP server framework                         |
| `mongoose`          | MongoDB object modelling                      |
| `bcryptjs`          | Password hashing                              |
| `express-session`   | Session management                            |
| `connect-mongo`     | MongoDB session store                         |
| `cors`              | Cross‑origin resource sharing                 |
| `dotenv`            | Environment variable support                  |
| `morgan`            | HTTP request logger                           |
| `nodemon`           | Development utility for auto‑restarting the server (`dev` script) |

If you add new dependencies for additional CSS tooling (e.g., `sass` or `postcss`), install them in the respective directory using `npm install`.

## Notes

* The project still uses the existing **ThemeContext** to apply light and
  dark themes.  No functionality was removed—styling was simply moved to
  CSS to make hover effects and animations smoother.
* The API endpoints and data models remain unchanged; no breaking changes
  were introduced on the backend.
