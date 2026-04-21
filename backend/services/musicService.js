const axios = require('axios');

// Mood to iTunes Search Terms mapping
const moodMap = {
    happy: 'pop upbeat party',
    sad: 'acoustic melancholy sad',
    angry: 'rock metal hard',
    chill: 'lofi jazz chill',
    romantic: 'rnb romance soft',
    neutral: 'indie trending'
};

const getSongsByMood = async (mood, filter) => {
    try {
        let queryTerm = moodMap[mood.toLowerCase()] || moodMap.neutral;
        
        // Append filter if exists (e.g. "Bollywood", "Punjabi")
        if (filter) {
            queryTerm += ` ${filter}`;
        }

        // Search iTunes API (No Auth required)
        const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(queryTerm)}&media=music&limit=25`);
        
        return mapITunesData(response.data.results, mood);
    } catch (error) {
        console.error('iTunes API Error:', error.message);
        throw new Error('Failed to fetch music recommendations');
    }
};

const searchSongs = async (query) => {
    try {
        const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`);
        return mapITunesData(response.data.results, 'search');
    } catch (error) {
        throw new Error('Failed to search music');
    }
};

// Map iTunes response to our Song model structure
const mapITunesData = (results, defaultMood) => {
    return results.filter(track => track.previewUrl).map(track => ({
        id: track.trackId.toString(),
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        // Get high-res cover art (replace 100x100 with 600x600)
        albumArt: track.artworkUrl100 ? track.artworkUrl100.replace('100x100', '600x600') : null,
        previewUrl: track.previewUrl,
        duration: track.trackTimeMillis,
        genre: track.primaryGenreName,
        mood: defaultMood
    }));
};

module.exports = {
    getSongsByMood,
    searchSongs,
    moodMap
};
