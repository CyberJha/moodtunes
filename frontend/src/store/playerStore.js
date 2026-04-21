import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  volume: 0.8,
  
  setCurrentSong: (song) => set({ currentSong: song }),
  setPlaylist: (songs) => set({ playlist: songs }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (vol) => set({ volume: vol }),
  playNext: () => set((state) => {
      if(state.playlist.length === 0 || !state.currentSong) return state;
      const currentIndex = state.playlist.findIndex(s => s.id === state.currentSong.id);
      const nextIndex = (currentIndex + 1) % state.playlist.length;
      return { currentSong: state.playlist[nextIndex], isPlaying: true };
  }),
  playPrevious: () => set((state) => {
      if(state.playlist.length === 0 || !state.currentSong) return state;
      const currentIndex = state.playlist.findIndex(s => s.id === state.currentSong.id);
      const prevIndex = currentIndex === 0 ? state.playlist.length - 1 : currentIndex - 1;
      return { currentSong: state.playlist[prevIndex], isPlaying: true };
  })
}));

export default usePlayerStore;
