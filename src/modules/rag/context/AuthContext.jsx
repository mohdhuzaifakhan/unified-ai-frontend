import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // We need to implement this endpoint in backend or infer from existing
            // For now, we'll try to access a protected route to check cookie validity
            // Or better, add /api/auth/me to flask
            const res = await axios.get('/api/auth/me');
            if (res.data.user) {
                setUser(res.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        if (res.data.status === 'success') {
            // Fetch user details or set basic info
            setUser({ email });
            return true;
        }
        return false;
    };

    const logout = async () => {
        await axios.get('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
