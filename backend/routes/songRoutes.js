const express = require('express');
const router = express.Router();
const { getSongsByMood, searchSongs } = require('../services/musicService');
const { analyzeMood } = require('../services/moodService');
const { protect } = require('../middleware/auth');

// @route   GET /api/songs/recommendations?mood=happy&filter=bollywood
router.get('/recommendations', async (req, res) => {
    try {
        const { mood, filter } = req.query;
        if (!mood) return res.status(400).json({ message: 'Mood is required' });
        
        const songs = await getSongsByMood(mood, filter);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/songs/analyze-mood
router.post('/analyze-mood', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text input is required' });

        const detectedMood = analyzeMood(text);
        const songs = await getSongsByMood(detectedMood);
        
        res.json({ mood: detectedMood, songs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/songs/search?q=query
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Search query is required' });

        const songs = await searchSongs(q);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
