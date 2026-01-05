import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Kitapları yükle
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

    // Arama
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchBooks();
            return;
        }

        try {
            setLoading(true);
            const response = await booksAPI.search(searchQuery);
            setBooks(response.data);
        } catch (err) {
            setError('Arama yapılırken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">📚 Kitaplar</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Kitap veya yazar ara..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Ara
                    </button>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                fetchBooks();
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Temizle
                        </button>
                    )}
                </div>
            </form>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Book Grid */}
            {books.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    Kitap bulunamadı
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2">{book.title}</h2>

                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Yazar:</span> {book.author?.name || 'Bilinmiyor'}
                                </p>

                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">ISBN:</span> {book.isbn}
                                </p>

                                {book.publishedYear && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Yıl:</span> {book.publishedYear}
                                    </p>
                                )}

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {book.categories?.map((category) => (
                                        <span
                                            key={category.id}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                      {category.name}
                    </span>
                                    ))}
                                </div>

                                {book.description && (
                                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                                        {book.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Books;
