import axios from 'axios';

/*
 * Axios instance configured to send cookies to the backend.  The baseURL is
 * automatically proxied to `http://localhost:5000` by Vite during development
 * because of the proxy setting defined in `vite.config.js`.
 */
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;