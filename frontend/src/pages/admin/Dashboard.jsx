import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, authorsAPI, categoriesAPI } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        books: 0,
        authors: 0,
        categories: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [booksRes, authorsRes, categoriesRes] = await Promise.all([
                    booksAPI.getAll(),
                    authorsAPI.getAll(),
                    categoriesAPI.getAll(),
                ]);
                setStats({
                    books: booksRes.data.length,
                    authors: authorsRes.data.length,
                    categories: categoriesRes.data.length,
                });
            } catch (error) {
                console.error('Stats yüklenemedi:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">🎛️ Admin Panel</h1>

            {/* İstatistikler */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl font-bold">{stats.books}</div>
                    <div className="text-blue-100">Toplam Kitap</div>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl font-bold">{stats.authors}</div>
                    <div className="text-green-100">Toplam Yazar</div>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl font-bold">{stats.categories}</div>
                    <div className="text-purple-100">Toplam Kategori</div>
                </div>
            </div>

            {/* Hızlı Erişim */}
            <h2 className="text-2xl font-semibold mb-4">Hızlı İşlemler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    to="/admin/books/new"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                >
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold">Yeni Kitap Ekle</div>
                    <div className="text-gray-500 text-sm">Kitap koleksiyonuna ekle</div>
                </Link>

                <Link
                    to="/admin/authors"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
                >
                    <div className="text-2xl mb-2">✍️</div>
                    <div className="font-semibold">Yazarları Yönet</div>
                    <div className="text-gray-500 text-sm">Yazar ekle/düzenle</div>
                </Link>

                <Link
                    to="/admin/categories"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                >
                    <div className="text-2xl mb-2">🏷️</div>
                    <div className="font-semibold">Kategorileri Yönet</div>
                    <div className="text-gray-500 text-sm">Kategori ekle/düzenle</div>
                </Link>

                <Link
                    to="/admin/books"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500"
                >
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">Kitap Listesi</div>
                    <div className="text-gray-500 text-sm">Tüm kitapları görüntüle</div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
