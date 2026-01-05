import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({ name: '' });
    const [editingId, setEditingId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (err) {
            setError('Kategoriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFormLoading(true);

        try {
            if (editingId) {
                await categoriesAPI.update(editingId, formData);
                setSuccess('Kategori başarıyla güncellendi');
            } else {
                await categoriesAPI.create(formData);
                setSuccess('Kategori başarıyla eklendi');
            }

            setFormData({ name: '' });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'İşlem başarısız');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name });
        setEditingId(category.id);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setFormData({ name: '' });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await categoriesAPI.delete(id);
            setSuccess('Kategori başarıyla silindi');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Silme işlemi başarısız');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">🏷️ Kategori Yönetimi</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
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
                                    Kategori Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Örn: Bilim Kurgu"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
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
                                    Kategori Adı
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
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Henüz kategori eklenmemiş
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {category.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {category.name}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {category.books?.length || 0} kitap
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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

export default Categories;
