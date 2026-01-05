import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        📚 Kütüphane Yönetim Sistemi
                    </h1>
                    <p className="text-xl mb-8">
                        Kitaplarınızı keşfedin, yönetin ve düzenleyin
                    </p>

                    {!user && (
                        <div className="space-x-4">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100"
                            >
                                Hemen Başla
                            </Link>
                            <Link
                                to="/books"
                                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Kitapları Gör
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl mb-4">📖</div>
                        <h3 className="text-xl font-semibold mb-2">Kitap Koleksiyonu</h3>
                        <p className="text-gray-600">
                            Binlerce kitap arasından arama yapın ve keşfedin
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl mb-4">✍️</div>
                        <h3 className="text-xl font-semibold mb-2">Yazar Bilgileri</h3>
                        <p className="text-gray-600">
                            Yazarlar hakkında detaylı bilgilere ulaşın
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl mb-4">🏷️</div>
                        <h3 className="text-xl font-semibold mb-2">Kategoriler</h3>
                        <p className="text-gray-600">
                            Kitapları kategorilere göre filtreleyin
                        </p>
                    </div>
                </div>
            </div>

            {/* User Welcome */}
            {user && (
                <div className="bg-green-100 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-semibold text-green-800">
                            Hoş geldin, {user.name}! 👋
                        </h2>
                        <p className="text-green-600 mt-2">
                            {user.role === 'admin'
                                ? 'Admin panelinizden kitap, yazar ve kategori yönetimi yapabilirsiniz.'
                                : 'Kitapları keşfetmeye başlayabilirsiniz.'}
                        </p>
                        <div className="mt-4">
                            {user.role === 'admin' ? (
                                <Link
                                    to="/admin"
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    Admin Paneli
                                </Link>
                            ) : (
                                <Link
                                    to="/books"
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    Kitapları Keşfet
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
