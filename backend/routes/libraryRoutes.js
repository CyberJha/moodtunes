const express = require('express');
const router = express.Router();
const { Favorite, History, Song } = require('../models');
const { protect } = require('../middleware/auth');

// GET all favorites
router.get('/favorites', protect, async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { userId: req.user.id },
            include: [{ model: Song }]
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST append to favorites
router.post('/favorites', protect, async (req, res) => {
    const { song } = req.body; // Expect full song object to ensure it's in our DB

    try {
        // Ensure song exists in DB first
        let dbSong = await Song.findByPk(song.id);
        if (!dbSong) {
            dbSong = await Song.create(song);
        }

        // Check if already favorite
        const existing = await Favorite.findOne({ where: { userId: req.user.id, songId: song.id } });
        if (existing) return res.status(400).json({ message: 'Already in favorites' });

        const favorite = await Favorite.create({
            userId: req.user.id,
            songId: song.id
        });

        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE from favorites
router.delete('/favorites/:songId', protect, async (req, res) => {
    try {
        const result = await Favorite.destroy({
            where: { userId: req.user.id, songId: req.params.songId }
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Add to history
router.post('/history', protect, async (req, res) => {
    const { song } = req.body;
    try {
        let dbSong = await Song.findByPk(song.id);
        if (!dbSong) {
            dbSong = await Song.create(song);
        }

        await History.create({
            userId: req.user.id,
            songId: song.id
        });
        
        res.status(201).json({ message: 'Added to history' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Recent History
router.get('/history', protect, async (req, res) => {
    try {
        const history = await History.findAll({
            where: { userId: req.user.id },
            include: [{ model: Song }],
            order: [['playedAt', 'DESC']],
            limit: 50
        });
        // Deduplicate songs
        const uniqueSongs = [];
        const songIds = new Set();
        history.forEach(h => {
             if(h.Song && !songIds.has(h.Song.id)) {
                 songIds.add(h.Song.id);
                 uniqueSongs.push(h);
             }
        });
        
        res.json(uniqueSongs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
