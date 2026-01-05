import { useState, useEffect } from 'react';
import { authorsAPI } from '../../services/api';

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({ name: '', bio: '' });
    const [editingId, setEditingId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Yazarları yükle
    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await authorsAPI.getAll();
            setAuthors(response.data);
        } catch (err) {
            setError('Yazarlar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Form gönder (Ekle veya Güncelle)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFormLoading(true);

        try {
            if (editingId) {
                // Güncelle
                await authorsAPI.update(editingId, formData);
                setSuccess('Yazar başarıyla güncellendi');
            } else {
                // Yeni ekle
                await authorsAPI.create(formData);
                setSuccess('Yazar başarıyla eklendi');
            }

            // Formu temizle ve listeyi yenile
            setFormData({ name: '', bio: '' });
            setEditingId(null);
            fetchAuthors();
        } catch (err) {
            setError(err.response?.data?.message || 'İşlem başarısız');
        } finally {
            setFormLoading(false);
        }
    };

    // Düzenleme moduna geç
    const handleEdit = (author) => {
        setFormData({ name: author.name, bio: author.bio || '' });
        setEditingId(author.id);
        setError('');
        setSuccess('');
    };

    // Düzenlemeyi iptal et
    const handleCancel = () => {
        setFormData({ name: '', bio: '' });
        setEditingId(null);
    };

    // Sil
    const handleDelete = async (id) => {
        if (!window.confirm('Bu yazarı silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await authorsAPI.delete(id);
            setSuccess('Yazar başarıyla silindi');
            fetchAuthors();
        } catch (err) {
            setError(err.response?.data?.message || 'Silme işlemi başarısız');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">✍️ Yazar Yönetimi</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Yazarı Düzenle' : 'Yeni Yazar Ekle'}
                        </h2>

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

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Yazar Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Örn: Orhan Pamuk"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Biyografi
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    rows="4"
                                    placeholder="Yazar hakkında kısa bilgi..."
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {formLoading ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Ekle')}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Liste */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kitap Sayısı
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : authors.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Henüz yazar eklenmemiş
                                    </td>
                                </tr>
                            ) : (
                                authors.map((author) => (
                                    <tr key={author.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {author.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {author.name}
                                            </div>
                                            {author.bio && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {author.bio}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {author.books?.length || 0} kitap
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(author)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(author.id)}
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
            </div>
        </div>
    );
};

export default Authors;
