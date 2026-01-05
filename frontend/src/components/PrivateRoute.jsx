import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    // Yükleniyorsa bekle
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Giriş yapılmamışsa login'e yönlendir
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Admin sayfasına admin olmayan erişmeye çalışırsa
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
