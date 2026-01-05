import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await booksAPI.getAll();
            setBooks(response.data);
        } catch (err) {
            setError('Kitaplar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`"${title}" kitabını silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await booksAPI.delete(id);
            setSuccess('Kitap başarıyla silindi');
            fetchBooks();
        } catch (err) {
            setError(err.response?.data?.message || 'Silme işlemi başarısız');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">📋 Kitap Listesi</h1>
                <Link
                    to="/admin/books/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Yeni Kitap Ekle
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Başlık
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Yazar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kategoriler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Yıl
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center">
                                Yükleniyor...
                            </td>
                        </tr>
                    ) : books.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                Henüz kitap eklenmemiş
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {book.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {book.title}
                                    </div>
                                    <div className="text-sm text-gray-500">{book.isbn}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {book.author?.name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {book.categories?.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                                            >
                          {cat.name}
                        </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {book.publishedYear || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/admin/books/edit/${book.id}`}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Düzenle
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(book.id, book.title)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookList;
