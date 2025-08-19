# YouTube Clone – MERN Stack

This repository contains a full–stack YouTube clone built with the **MERN** stack (MongoDB, Express, React and Node.js).  The goal of this project is to mirror many of the core features found in YouTube while adhering to modern development best‑practices, accessible design and professional styling.

## Highlights

* **Three‑colour theme:** The UI uses a **teal, white and red** palette and supports both light and dark themes.  A toggle switch lets the user change themes on the fly, and the entire interface reacts accordingly using CSS variables.
* **Smooth animations:** The interface includes fluid hover transitions and page animations powered by **Framer Motion**.  These animations are subtle enough to look professional but vibrant enough to make the site feel responsive.
* **Session‑based authentication:** User accounts are stored in **MongoDB** and passwords are hashed with **bcrypt**.  Login and registration are implemented using **express‑session** and **connect‑mongo** so that user information is stored securely on the server rather than in the client’s local storage.  A simple encryption helper is also used to encrypt and decrypt sensitive tokens on the server.
* **Feature complete clone:**  Users can register, create channels, upload video metadata (dummy URLs are used for demonstration), search for videos, filter by category, view a video player page with likes, dislikes and comments, and create/edit/delete comments.  Only the owner of a channel can edit or delete their videos.
* **Responsive design:** The application adapts to phones, tablets and desktops using CSS Grid and Flexbox.  The sidebar collapses on small screens and buttons scale gracefully.

## Project Structure

```
course-seven/
├── client/                 # React application (frontend)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    # Preconfigured Axios instance
│   │   ├── components/
│   │   │   ├── ChannelPage.js
│   │   │   ├── CommentList.js
│   │   │   ├── Header.js
│   │   │   ├── HomePage.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Sidebar.js
│   │   │   ├── ThemeToggle.js
│   │   │   ├── VideoCard.js
│   │   │   ├── VideoPlayerPage.js
│   │   │   └── VideoUpload.js
│   │   ├── context/
│   │   │   └── ThemeContext.js
│   │   ├── styles/
│   │   │   ├── animations.js
│   │   │   └── theme.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js      # Bundler configuration (Vite)
├── server/                 # Express application (backend)
│   ├── models/
│   │   ├── Channel.js
│   │   ├── Comment.js
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── commentRoutes.js
│   │   └── videoRoutes.js
│   ├── utils/
│   │   └── encryption.js   # Helper for encrypting/decrypting tokens
│   ├── middleware/
│   │   └── auth.js         # Middleware to protect routes
│   ├── server.js
│   ├── package.json
│   └── .env.example        # Environment variables template
└── README.md               # This file
```

## Running the project

> **Note:** Before running the project ensure that MongoDB is running locally or that you have a MongoDB Atlas connection string.

1. **Clone the repository** and navigate to the project root.

2. **Install server dependencies** (from the `server` directory):

   ```sh
   cd server
   npm install express mongoose bcryptjs express-session connect-mongo cors dotenv morgan
   ```

3. **Set up environment variables:** Copy the `.env.example` file to `.env` and fill in your MongoDB URI and session secret:

   ```sh
   cp .env.example .env
   # then edit .env to contain:
   # MONGODB_URI=mongodb://localhost:27017/youtubeClone
   # SESSION_SECRET=your_secret_string
   # PORT=5000
   ```

4. **Start the server:**

   ```sh
   npm run dev
   ```

5. **Install client dependencies** (from the `client` directory):

   ```sh
   cd ../client
   npm install react react-dom react-router-dom axios framer-motion styled-components
   ```

6. **Run the client:**

   ```sh
   npm run dev
   ```

7. **Open the application** in your browser at `http://localhost:5173` (or whatever port Vite indicates) and start exploring.  The server will be running on `http://localhost:5000` by default.

## Authentication

The server uses **express‑session** with a **MongoDB** store via **connect‑mongo**.  When a user registers or logs in:

* Passwords are hashed with **bcrypt** before storage.
* A session cookie is created and signed using the secret specified in your `.env` file.  This cookie is stored in the browser and used to authenticate subsequent requests.
* The session object (containing the user’s `id` and `username`) is stored in the MongoDB database via the session store.
* Sensitive tokens can optionally be encrypted on the server using the helper in `server/utils/encryption.js`.

Clients never store JWTs or user information in `localStorage` — the server maintains all state.  The React client simply sends requests with `credentials: 'include'` so that the session cookie is sent automatically.

## Features

### Home page

* Displays a header with a hamburger icon that toggles the sidebar.
* Shows filter buttons (e.g. **All**, **Education**, **Music**, etc.) that can be clicked to filter the video grid by category.
* Presents a responsive grid of video cards.  Each card includes a thumbnail, the video’s title, channel name and view count.  Hovering over cards triggers a subtle zoom‑in effect.
* A search bar in the header allows videos to be searched by title.

### Authentication

* Users can sign up with a username, email and password.  Passwords are hashed before storing.
* Users can log in with their email and password.  After logging in their name appears in the header and they gain access to channel creation and video upload.

### Video player page

* Clicking a video card navigates to a dedicated page that plays the selected video.  The page displays the video title, description, channel information, like/dislike buttons and a comment section.
* Comments can be added, edited and removed by the current user.  All comments are stored in the database and are associated with both the user and video.

### Channel page

* Authenticated users can create a channel by specifying a channel name and description.
* Each channel page lists the videos belonging to that channel.  Channel owners can upload new videos, edit existing video metadata, or delete videos.

## Advanced topics implemented

* **Theme toggling** is achieved using a `ThemeContext`.  CSS variables are bound to either a light or dark palette, and a toggle button in the header lets users switch modes.
* **Animations** are implemented using **Framer Motion**.  Page transitions, hover effects and modals all use animated states.
* **Encryption helper:** Sensitive tokens (such as password reset tokens) can be encrypted using AES‑256.  See `server/utils/encryption.js` for details.

## Contributing

This project was built as an educational capstone assignment.  Feel free to open issues or submit pull requests if you discover bugs or have suggestions for improvements.
