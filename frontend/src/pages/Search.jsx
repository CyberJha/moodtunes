import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';
import { Search as SearchIcon, Heart, PlayCircle, Music, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Search = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { setCurrentSong, setPlaylist, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isAuthenticated, token } = useAuthStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(`${API_BASE}/songs/search?q=${encodeURIComponent(query)}`);
      setSongs(res.data);
      setPlaylist(res.data);
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
       togglePlay();
    } else {
       setCurrentSong(song);
       if(!isPlaying) togglePlay();
       
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

  return (
    <div className="space-y-10 mt-10 max-w-6xl mx-auto pb-24">
      {/* Search Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-outfit">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-brand-500">vibe</span>
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-neon-purple rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
           <div className="relative flex items-center glass rounded-full p-2">
              <SearchIcon className="w-6 h-6 text-gray-400 ml-4" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs, artists, or albums..."
                className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none focus:ring-0 border-none"
              />
              <button 
                type="submit" disabled={loading || !query.trim()}
                className="bg-white text-black rounded-full px-6 py-3 font-semibold hover:scale-105 transition shadow-lg disabled:opacity-50"
              >
                 {loading ? 'Searching...' : 'Search'}
              </button>
           </div>
        </form>
      </section>

      {/* Results Grid */}
      <section>
          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-square w-full"></div>
                ))}
             </div>
          ) : hasSearched && songs.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {songs.map((song, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     key={song.id} 
                     className="group relative rounded-xl overflow-hidden glass hover:border-brand-500/50 transition-colors p-3 flex flex-col cursor-pointer"
                   >
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
                           <button 
                             onClick={(e) => { e.stopPropagation(); addToFavorites(song); }}
                             className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                           >
                              <Heart className="w-4 h-4 text-white hover:text-red-500 transition"/>
                           </button>
                       </div>
                       <h3 className="font-semibold text-white truncate w-full text-sm">{song.title}</h3>
                       <p className="text-gray-400 text-xs w-full truncate mt-1">{song.artist}</p>
                   </motion.div>
                ))}
             </div>
          ) : hasSearched && songs.length === 0 ? (
             <div className="text-center py-20 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}". Try another search.</p>
             </div>
          ) : null}
      </section>
    </div>
  );
};

export default Search;
