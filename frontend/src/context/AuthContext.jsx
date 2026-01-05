import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sayfa yüklendiğinde localStorage'dan kullanıcıyı al
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Giriş yap
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { user, access_token } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    // Kayıt ol
    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        const { user, access_token } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    // Çıkış yap
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Admin mi kontrolü
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
