import { useState, useRef, useEffect } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, volume, setVolume } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSong, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const width = progressBar.clientWidth;
      const newTime = (clickPosition / width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress((clickPosition / width) * 100);
    }
  };

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-white/10 z-50 overflow-visible"
      >
        {/* Dynamic Background Match */}
        <div 
           className="absolute inset-0 opacity-20 -z-10 bg-cover bg-center blur-xl scale-110 saturate-150"
           style={{ backgroundImage: `url(${currentSong.albumArt})` }}
        />

        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 bg-white/10 cursor-pointer hover:h-3 transition-all"
          onClick={handleSeek}
        >
           <div 
             className="h-full bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] relative" 
             style={{ width: `${progress}%` }}
           >
             {/* Scrub handle */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity translate-x-1/2 shadow-md"></div>
           </div>
        </div>

        <audio 
          ref={audioRef}
          src={currentSong.previewUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          autoPlay={isPlaying}
        />

        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Track Info */}
          <div className="flex items-center gap-4 w-1/3">
             <div className="relative w-16 h-16 rounded-md overflow-hidden shadow-lg border border-white/20">
                 <img src={currentSong.albumArt} alt="Cover" className="w-full h-full object-cover" />
                 {/* Spinning Vinyl Animation on Play */}
                 {isPlaying && (
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-black/50"
                        style={{ background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)' }}
                     />
                 )}
             </div>
             <div>
                <h4 className="font-semibold text-white truncate max-w-[200px]">{currentSong.title}</h4>
                <p className="text-sm text-gray-400 truncate max-w-[200px]">{currentSong.artist}</p>
             </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center justify-center w-1/3">
             <div className="flex items-center gap-6">
                <button onClick={playPrevious} className="text-gray-300 hover:text-white transition"><SkipBack className="w-6 h-6" /></button>
                
                <button 
                  onClick={togglePlay} 
                  className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition shadow-lg"
                >
                   {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                </button>
                
                <button onClick={playNext} className="text-gray-300 hover:text-white transition"><SkipForward className="w-6 h-6" /></button>
             </div>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center justify-end gap-4 w-1/3">
             <Volume2 className="w-5 h-5 text-gray-400" />
             <input 
               type="range" min="0" max="1" step="0.01" value={volume} 
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-24 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
             />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicPlayer;
