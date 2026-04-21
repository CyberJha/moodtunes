import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Library from './pages/Library';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="flex flex-col min-h-screen pb-24 relative overflow-hidden bg-dark-bg text-white">
        
        {/* Glow Effect Top Left */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-purple rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none"></div>
        {/* Glow Effect Bottom Right */}
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none"></div>

        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <MusicPlayer />
        <Toaster position="top-right" theme="dark" toastOptions={{
             style: {
               background: '#1e1e24',
               color: '#fff',
               border: '1px solid rgba(255,255,255,0.1)'
             }
        }} />
      </div>
    </Router>
  );
}

export default App;
