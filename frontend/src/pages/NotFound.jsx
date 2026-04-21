import { Link } from 'react-router-dom';
import { Home, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Music className="w-24 h-24 mx-auto text-brand-500 opacity-50 mb-6" />
        <h1 className="text-6xl md:text-8xl font-bold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-brand-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-6">Track Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Seems like the vibe you're looking for doesn't exist on this frequency. 
          Let's get you back to the main stage.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-lg"
        >
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
