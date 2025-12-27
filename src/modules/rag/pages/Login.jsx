import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

const Login = ({ isSignup = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignup) {
                await axios.post('/api/auth/signup', { email, password });
                // Auto login after signup or redirect to login
                const success = await login(email, password);
                if (success) navigate('/dashboard');
            } else {
                const success = await login(email, password);
                if (success) {
                    navigate('/dashboard');
                } else {
                    setError('Invalid credentials');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl mb-6 hover:opacity-80 transition-opacity">
                        <Zap className="text-brand-400 fill-brand-400/20" />
                        RAG Service
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isSignup ? 'Create an account' : 'Welcome back'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isSignup ? 'Start building intelligent workflows today' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignup ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <Link to={isSignup ? '/login' : '/signup'} className="text-brand-400 hover:text-brand-300 font-medium">
                        {isSignup ? 'Sign in' : 'Sign up'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
