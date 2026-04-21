import { create } from 'zustand';

const useMoodStore = create((set) => ({
  currentMood: 'neutral',
  setMood: (mood) => set({ currentMood: mood }),
}));

export default useMoodStore;
