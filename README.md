# 🎵 MoodTunes

MoodTunes is a dynamic, AI-powered music web application that curate playlists based on your mood. It features a sleek glassmorphism UI, a custom React music player, and intelligent search capabilities to create personalized vibes instantly.

![App Preview](https://via.placeholder.com/1000x500.png?text=MoodTunes+Preview) <!-- Replace with your actual screenshot link once uploaded! -->

## 🌟 Features
- **AI Mood Detection**: Type how you're feeling ("I just had a breakup" or "I'm super energetic") and let the lightweight NLP algorithm analyze your text to curate the perfect Mix.
- **Glassmorphism UI**: A gorgeous, modern UI utilizing Framer Motion for smooth page transitions, interactive hover states, and dynamic album backgrounds.
- **Persistent Music Player**: Custom-built music player hooked directly into Apple's public iTunes API, allowing you to seek through 30-second previews seamlessly.
- **Unified Full-Stack Deployment**: Fully capable of serving the statically built React frontend directly from the Node.js Express backend, making it trivial to tunnel using ngrok!
- **Library & History Tracking**: User authentication allows you to securely save your favorite tracks and review your listening history.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Zustand (State Management), React Router
- **Backend**: Node.js, Express.js, Sequelize ORM (MySQL), JWT Authentication
- **External APIs**: iTunes Search API

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- MySQL Database

### 1. Database Setup
Create a MySQL database named `moodtunes`.

### 2. Backend Setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in your DB credentials and secret keys. Then start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Configure your `.env` to point to the local API: `VITE_API_URL=http://localhost:5000/api`
Then start the Vite dev server:
```bash
npm run dev
```

Enjoy your music! 🎧
