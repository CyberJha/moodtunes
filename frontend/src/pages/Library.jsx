import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';
import { Heart, Clock, PlayCircle, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';



const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('favorites'); // favorites or history
    
    const { token } = useAuthStore();
    const { setCurrentSong, setPlaylist, currentSong, isPlaying, togglePlay } = usePlayerStore();

    useEffect(() => {
        fetchLibraryData();
    }, [activeTab]);

    const fetchLibraryData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'favorites') {
                const res = await axios.get(`${API_BASE}/library/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(res.data.map(f => f.Song));
            } else {
                const res = await axios.get(`${API_BASE}/library/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data.map(h => h.Song));
            }
        } catch (err) {
            toast.error(`Failed to load ${activeTab}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (song, collection) => {
        if (currentSong?.id === song.id) {
           togglePlay();
        } else {
           setCurrentSong(song);
           setPlaylist(collection);
           if (!isPlaying) togglePlay();
        }
    };

    const removeFromFavorites = async (e, songId) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_BASE}/library/favorites/${songId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(s => s.id !== songId));
            toast.success('Removed from favorites');
        } catch (err) {
            toast.error('Failed to remove');
        }
    };

    const renderList = (songs, isFav = false) => {
        if (loading) return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                        <div className="w-16 h-16 bg-white/10 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-4 bg-white/10 rounded w-1/4"></div>
                           <div className="h-3 bg-white/10 rounded w-1/5"></div>
                        </div>
                    </div>
                ))}
            </div>
        );

        if (songs.length === 0) return (
            <div className="text-center py-20 text-gray-400">
                {isFav ? <Heart className="w-12 h-12 mx-auto mb-4 opacity-50"/> : <Clock className="w-12 h-12 mx-auto mb-4 opacity-50"/>}
                <p>No songs found in your {activeTab}.</p>
            </div>
        );

        return (
            <div className="space-y-3">
                {songs.map((song, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={song.id}
                        onClick={() => handlePlay(song, songs)}
                        className="group flex items-center gap-4 glass p-3 rounded-xl hover:bg-white/10 transition cursor-pointer"
                    >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                {(currentSong?.id === song.id && isPlaying) ? <Pause className="fill-white"/> : <PlayCircle className="w-6 h-6"/>}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold truncate ${currentSong?.id === song.id ? 'text-brand-500' : 'text-white'}`}>
                                {song.title}
                            </h4>
                            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                        </div>
                        {isFav && (
                            <button 
                               onClick={(e) => removeFromFavorites(e, song.id)}
                               className="p-3 text-brand-500 hover:bg-white/10 rounded-full transition"
                            >
                                <Heart className="w-5 h-5 fill-current" />
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-10">
            <h1 className="text-4xl font-bold font-outfit">Your Library</h1>
            
            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center gap-2 pb-3 px-4 font-medium transition-colors relative ${activeTab === 'favorites' ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}
                >
                    <Heart className="w-5 h-5"/> Favorites
                    {activeTab === 'favorites' && <motion.div layoutId="tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-500" />}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 pb-3 px-4 font-medium transition-colors relative ${activeTab === 'history' ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}
                >
                    <Clock className="w-5 h-5"/> Recently Played
                    {activeTab === 'history' && <motion.div layoutId="tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-500" />}
                </button>
            </div>

            <div className="mt-8">
                {activeTab === 'favorites' ? renderList(favorites, true) : renderList(history, false)}
            </div>
        </div>
    );
};

export default Library;
