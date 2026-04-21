// Central API base URL — reads from .env, falls back to localhost for dev
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios default headers — bypasses ngrok browser warning page
import axios from 'axios';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
