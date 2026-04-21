import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';
import { Search, Heart, PlayCircle, Sparkles, Music, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useMoodStore from '../store/moodStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';


const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moodInput, setMoodInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  const { currentMood, setMood } = useMoodStore();
  const { setCurrentSong, setPlaylist, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    fetchRecommendations(currentMood, activeFilter);
  }, [currentMood, activeFilter]);

  const fetchRecommendations = async (mood, filter) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ mood });
      if (filter) queryParams.append('filter', filter);
      
      const res = await axios.get(`${API_BASE}/songs/recommendations?${queryParams.toString()}`);
      setSongs(res.data);
      setPlaylist(res.data);
    } catch (err) {
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const analyzeMood = async (e) => {
    e.preventDefault();
    if (!moodInput) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/songs/analyze-mood`, { text: moodInput });
      if (res.data.mood) {
          setMood(res.data.mood);
          setSongs(res.data.songs);
          setPlaylist(res.data.songs);
          toast.success(`Mood detected: ${res.data.mood.charAt(0).toUpperCase() + res.data.mood.slice(1)}`);
      }
    } catch (error) {
       toast.error('Analysis failed');
    } finally {
       setLoading(false);
       setMoodInput('');
    }
  };

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
       togglePlay();
    } else {
       setCurrentSong(song);
       if(!isPlaying) togglePlay();
       
       // Log history if authenticated
       if (isAuthenticated && token) {
           axios.post(`${API_BASE}/library/history`, { song }, {
               headers: { Authorization: `Bearer ${token}` }
           }).catch(e => console.log('History log failed', e));
       }
    }
  };

  const addToFavorites = async (song) => {
      if(!isAuthenticated) return toast.error('Please login to save favorites');
      try {
          await axios.post(`${API_BASE}/library/favorites`, { song }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Added to favorites');
      } catch (err) {
          toast.error(err.response?.data?.message || 'Already in favorites');
      }
  };

  const moodEmojis = [
    { mood: 'happy', emoji: '😄', color: 'from-yellow-400 to-orange-500' },
    { mood: 'sad', emoji: '😢', color: 'from-blue-400 to-blue-600' },
    { mood: 'chill', emoji: '🎧', color: 'from-purple-400 to-indigo-500' },
    { mood: 'angry', emoji: '😠', color: 'from-red-500 to-rose-600' },
    { mood: 'romantic', emoji: '💖', color: 'from-pink-400 to-rose-400' },
  ];

  const categories = ['Bollywood', 'Hollywood', 'Punjabi', 'Indie', 'Hip Hop', 'Rock', 'Jazz', 'EDM', 'Classical'];

  return (
    <div className="space-y-12 pb-24">
      {/* Hero / Mood Detector */}
      <section className="text-center space-y-8 mt-10">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
           <h1 className="text-5xl md:text-7xl font-bold mb-4 font-outfit">
             How are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-brand-500">feeling</span> today?
           </h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Tell us your thoughts or pick a mood, and our AI will curate the perfect soundtrack for your moment.
           </p>
        </motion.div>

        {/* Text Input */}
        <form onSubmit={analyzeMood} className="max-w-xl mx-auto relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-neon-purple rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
           <div className="relative flex items-center glass rounded-full p-2">
              <input 
                type="text"
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="E.g., I just had a great cup of coffee..."
                className="w-full bg-transparent text-white placeholder-gray-400 px-6 py-3 outline-none focus:ring-0 border-none"
              />
              <button 
                type="submit" disabled={loading}
                className="bg-white text-black rounded-full px-6 py-3 font-semibold flex items-center gap-2 hover:scale-105 transition shadow-lg disabled:opacity-50"
              >
                 {loading ? 'Thinking...' : <><Sparkles className="w-4 h-4"/> Sync</>}
              </button>
           </div>
        </form>

        {/* Emoji Selector */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
           {moodEmojis.map(({ mood, emoji, color }) => (
               <button
                 key={mood}
                 onClick={() => setMood(mood)}
                 className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                     currentMood === mood 
                     ? `bg-gradient-to-r ${color} text-white shadow-lg scale-110` 
                     : 'glass text-gray-300 hover:text-white hover:border-white/30'
                 }`}
               >
                 <span className="text-xl">{emoji}</span>
                 <span className="capitalize">{mood}</span>
               </button>
           ))}
        </div>
      </section>

      {/* Filter System */}
      <section className="mb-6 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-3 px-2 min-w-max">
             <button 
                onClick={() => setActiveFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                    activeFilter === '' ? 'bg-white text-black shadow-lg' : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                }`}
             >
                All
             </button>
             {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeFilter === cat ? 'bg-white text-black shadow-lg' : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
             ))}
          </div>
      </section>

      {/* Recommendations Grid */}
      <section>
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                 <Music className="w-5 h-5 text-brand-500"/> 
                 {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mix
              </h2>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-square w-full"></div>
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {songs.map((song, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     key={song.id} 
                     className="group relative rounded-xl overflow-hidden glass hover:border-brand-500/50 transition-colors p-3 flex flex-col cursor-pointer"
                   >
                       {/* Album Art Container */}
                       <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3">
                           <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handlePlay(song); }}
                                 className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                               >
                                  {(currentSong?.id === song.id && isPlaying) ? <Pause className="fill-white"/> : <PlayCircle className="w-8 h-8"/>}
                               </button>
                           </div>
                           {/* Add to Favorites */}
                           <button 
                             onClick={(e) => { e.stopPropagation(); addToFavorites(song); }}
                             className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                           >
                              <Heart className="w-4 h-4 text-white hover:text-red-500 transition"/>
                           </button>
                       </div>
                       {/* Meta */}
                       <h3 className="font-semibold text-white truncate w-full text-sm">{song.title}</h3>
                       <p className="text-gray-400 text-xs w-full truncate mt-1">{song.artist}</p>
                   </motion.div>
                ))}
             </div>
          )}
          {!loading && songs.length === 0 && (
             <div className="text-center py-20 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No songs found for this mood. Try something else!</p>
             </div>
          )}
      </section>
    </div>
  );
};

export default Home;
