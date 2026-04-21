import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
            login(res.data, res.data.token);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-md w-full space-y-8 glass p-10 rounded-3xl border border-white/10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
                
                <div className="text-center pb-4 relative z-10">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-brand-500 to-neon-purple rounded-xl flex items-center justify-center mb-4">
                        <Music className="w-6 h-6 text-white"/>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-400">Sign in to your account and sync your mood</p>
                </div>

                <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-10 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-10 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit" disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-6 text-sm relative z-10">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-brand-500 hover:text-brand-400 transition">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
