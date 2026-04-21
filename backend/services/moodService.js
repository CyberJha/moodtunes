// Basic NLP using Keyword Mapping (Client-side / Lightweight Node)
const { moodMap } = require('./musicService');

const analyzeMood = (text) => {
    const textLower = text.toLowerCase();
    
    const keywords = {
        happy: ['happy', 'great', 'awesome', 'good', 'excited', 'joy', 'party', 'amazing', 'fun', 'win', 'sunshine', 'upbeat'],
        sad: ['sad', 'depressed', 'down', 'crying', 'lonely', 'broken', 'breakup', 'dumped', 'heartbreak', 'lost', 'tears', 'miss', 'alone'],
        angry: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'pissed', 'frustrated', 'rage', 'bad', 'stupid', 'worst'],
        chill: ['chill', 'relaxed', 'calm', 'tired', 'sleepy', 'lazy', 'peace', 'vibes', 'evening', 'coffee', 'study', 'focus'],
        romantic: ['love', 'romantic', 'crush', 'date', 'sweet', 'beautiful', 'kiss', 'heart', 'forever', 'together'],
    };

    let detectedMood = 'neutral';
    let highestScore = 0;

    for (const [mood, words] of Object.entries(keywords)) {
        let score = words.filter(word => textLower.includes(word)).length;
        if (score > highestScore) {
            highestScore = score;
            detectedMood = mood;
        }
    }

    return detectedMood;
};

module.exports = { analyzeMood };
