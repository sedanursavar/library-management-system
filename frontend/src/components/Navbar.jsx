import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold">
                        📚 Kütüphane
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="hover:text-blue-200">
                            Ana Sayfa
                        </Link>
                        <Link to="/books" className="hover:text-blue-200">
                            Kitaplar
                        </Link>

                        {/* Admin Menu */}
                        {isAdmin() && (
                            <Link to="/admin" className="hover:text-blue-200">
                                Admin Panel
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                <span className="text-blue-200">
                  Merhaba, {user.name}
                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                                >
                                    Çıkış
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    to="/login"
                                    className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded"
                                >
                                    Giriş
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded border border-white"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
