import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, User, Music, LogIn, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-neon-purple flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-shadow">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            MoodTunes
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-brand-500 font-semibold' : 'text-gray-300 hover:text-white'}`}>Home</Link>
          <Link to="/search" className={`flex items-center gap-1 transition-colors ${location.pathname === '/search' ? 'text-brand-500 font-semibold' : 'text-gray-300 hover:text-white'}`}>
             <Search className="w-4 h-4"/> Search
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/library" className={`transition-colors ${location.pathname === '/library' ? 'text-brand-500 font-semibold' : 'text-gray-300 hover:text-white'}`}>Library</Link>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                  {user?.avatar && user.avatar !== 'default_avatar.png' ? (
                     <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : <User className="w-5 h-5 text-gray-400" />}
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium border border-white/5 hover:border-white/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 space-y-4">
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${location.pathname === '/' ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}>Home</Link>
               <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 transition-colors ${location.pathname === '/search' ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}>
                 <Search className="w-4 h-4"/> Search
               </Link>
               
               {isAuthenticated ? (
                 <>
                   <Link to="/library" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${location.pathname === '/library' ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}>Library</Link>
                   <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                          {user?.avatar && user.avatar !== 'default_avatar.png' ? (
                             <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : <User className="w-5 h-5 text-gray-400" />}
                        </div>
                        <span className="text-sm font-medium">{user?.username}</span>
                     </div>
                     <button 
                       onClick={handleLogout}
                       className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                     >
                       <LogOut className="w-4 h-4" />
                       Logout
                     </button>
                   </div>
                 </>
               ) : (
                  <div className="border-t border-white/10 pt-4 mt-2 flex flex-col space-y-3">
                     <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-1 w-full py-2 bg-white/5 rounded-lg text-gray-300 hover:text-white">
                       <LogIn className="w-4 h-4" /> Login
                     </Link>
                     <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full py-2 rounded-lg bg-brand-500 text-white font-medium">
                       Sign Up
                     </Link>
                  </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
