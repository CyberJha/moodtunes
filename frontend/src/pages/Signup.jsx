import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/signup`, { username, email, password });
            login(res.data, res.data.token);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-md w-full space-y-8 glass p-10 rounded-3xl border border-white/10 relative overflow-hidden"
            >
                <div className="absolute bottom-0 left-0 -m-8 w-32 h-32 bg-neon-purple rounded-full blur-3xl opacity-20"></div>

                <div className="text-center pb-4 relative z-10">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-brand-500 to-neon-purple rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Music className="w-6 h-6 text-white"/>
                    </div>
                    <h2 className="text-3xl font-extrabold items-center text-white mb-2">Create Account</h2>
                    <p className="text-sm text-gray-400">Join MoodTunes to save your history and favorites</p>
                </div>

                <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <User className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text" required
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-10 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple sm:text-sm transition"
                                placeholder="Username"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-10 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple sm:text-sm transition"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-10 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple sm:text-sm transition"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit" disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-brand-500 to-neon-purple hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-6 text-sm relative z-10">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-brand-500 hover:text-brand-400 transition">
                            Log in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
