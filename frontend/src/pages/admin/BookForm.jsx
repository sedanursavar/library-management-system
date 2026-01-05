import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI, authorsAPI, categoriesAPI } from '../../services/api';

const BookForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Düzenleme için ID
    const isEditing = Boolean(id);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        description: '',
        publishedYear: '',
        authorId: '',
        categoryIds: [],
    });

    // Dropdown verileri
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');

    // Yazarları ve kategorileri yükle
    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                const [authorsRes, categoriesRes] = await Promise.all([
                    authorsAPI.getAll(),
                    categoriesAPI.getAll(),
                ]);
                setAuthors(authorsRes.data);
                setCategories(categoriesRes.data);

                // Düzenleme moduysa kitap bilgilerini yükle
                if (isEditing) {
                    const bookRes = await booksAPI.getOne(id);
                    const book = bookRes.data;
                    setFormData({
                        title: book.title,
                        isbn: book.isbn,
                        description: book.description || '',
                        publishedYear: book.publishedYear || '',
                        authorId: book.author?.id || '',
                        categoryIds: book.categories?.map((c) => c.id) || [],
                    });
                }
            } catch (err) {
                setError('Veriler yüklenirken hata oluştu');
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    // Input değişikliği
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Kategori checkbox değişikliği (Multi-Select)
    const handleCategoryChange = (categoryId) => {
        setFormData((prev) => {
            const currentIds = prev.categoryIds;

            if (currentIds.includes(categoryId)) {
                // Zaten seçiliyse, çıkar
                return {
                    ...prev,
                    categoryIds: currentIds.filter((id) => id !== categoryId),
                };
            } else {
                // Seçili değilse, ekle
                return {
                    ...prev,
                    categoryIds: [...currentIds, categoryId],
                };
            }
        });
    };

    // Form gönder
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validasyon
        if (!formData.authorId) {
            setError('Lütfen bir yazar seçin');
            return;
        }

        if (formData.categoryIds.length === 0) {
            setError('Lütfen en az bir kategori seçin');
            return;
        }

        setLoading(true);

        try {
            // Backend'e gönderilecek veri
            const bookData = {
                title: formData.title,
                isbn: formData.isbn,
                description: formData.description || null,
                publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
                authorId: parseInt(formData.authorId),
                categoryIds: formData.categoryIds.map((id) => parseInt(id)),
            };

            if (isEditing) {
                await booksAPI.update(id, bookData);
            } else {
                await booksAPI.create(bookData);
            }

            navigate('/admin/books');
        } catch (err) {
            setError(err.response?.data?.message || 'Kitap kaydedilemedi');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {isEditing ? '📝 Kitabı Düzenle' : '📚 Yeni Kitap Ekle'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Uyarı: Yazar veya kategori yoksa */}
                {(authors.length === 0 || categories.length === 0) && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                        <strong>Uyarı:</strong> Kitap eklemeden önce en az bir{' '}
                        {authors.length === 0 && <span>yazar</span>}
                        {authors.length === 0 && categories.length === 0 && ' ve '}
                        {categories.length === 0 && <span>kategori</span>} eklemelisiniz.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    {/* Kitap Başlığı */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Kitap Başlığı *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Örn: Suç ve Ceza"
                            required
                        />
                    </div>

                    {/* ISBN */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            ISBN *
                        </label>
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Örn: 978-3-16-148410-0"
                            required
                        />
                    </div>

                    {/* Yayın Yılı */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Yayın Yılı
                        </label>
                        <input
                            type="number"
                            name="publishedYear"
                            value={formData.publishedYear}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Örn: 1866"
                            min="1000"
                            max={new Date().getFullYear()}
                        />
                    </div>

                    {/* Yazar Seçimi (Dropdown) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Yazar * (Select Author)
                        </label>
                        <select
                            name="authorId"
                            value={formData.authorId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">-- Yazar Seçin --</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        {authors.length === 0 && (
                            <p className="text-red-500 text-sm mt-1">
                                Henüz yazar eklenmemiş.{' '}
                                <a href="/admin/authors" className="underline">
                                    Yazar ekle
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Kategori Seçimi (Multi-Select Checkbox) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Kategoriler * (Select Categories - Birden fazla seçilebilir)
                        </label>
                        <div className="border border-gray-300 rounded p-3 max-h-48 overflow-y-auto">
                            {categories.length === 0 ? (
                                <p className="text-red-500 text-sm">
                                    Henüz kategori eklenmemiş.{' '}
                                    <a href="/admin/categories" className="underline">
                                        Kategori ekle
                                    </a>
                                </p>
                            ) : (
                                categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categoryIds.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-700">{category.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        {formData.categoryIds.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.categoryIds.length} kategori seçildi
                            </p>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Açıklama
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            rows="4"
                            placeholder="Kitap hakkında kısa açıklama..."
                        />
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || authors.length === 0 || categories.length === 0}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kitabı Ekle')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
