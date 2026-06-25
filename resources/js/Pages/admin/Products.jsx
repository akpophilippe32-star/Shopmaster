import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '', category_id: '', price: '',
        promotion_price: '', quantity: '', description: ''
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data.data || []);
    };

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key]) formData.append(key, form[key]);
            });
            images.forEach(img => formData.append('images[]', img));

            if (editing) {
                formData.append('_method', 'PUT');
                await api.post(`/products/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setForm({ name: '', category_id: '', price: '', promotion_price: '', quantity: '', description: '' });
            setImages([]);
            setPreviews([]);
            setEditing(null);
            setShowForm(false);
            fetchProducts();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleEdit = (product) => {
        setEditing(product.id);
        setForm({
            name:            product.name,
            category_id:     product.category_id,
            price:           product.price,
            promotion_price: product.promotion_price || '',
            quantity:        product.quantity,
            description:     product.description || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const getImageUrl = (product) => {
        if (product.images?.length > 0) {
            const url = product.images[0].image_url;
            if (url.startsWith('http')) return url;
            return `http://127.0.0.1:8000/storage/${url}`;
        }
        return null;
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditing(null);
                        setForm({ name: '', category_id: '', price: '', promotion_price: '', quantity: '', description: '' });
                        setImages([]);
                        setPreviews([]);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Ajouter
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                        {editing ? 'Modifier' : 'Ajouter'} un produit
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-1">Nom</label>
                                <input type="text" value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Catégorie</label>
                                <select value={form.category_id}
                                    onChange={e => setForm({...form, category_id: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required>
                                    <option value="">Choisir...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Prix</label>
                                <input type="number" value={form.price}
                                    onChange={e => setForm({...form, price: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Prix promo</label>
                                <input type="number" value={form.promotion_price}
                                    onChange={e => setForm({...form, promotion_price: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Quantité</label>
                                <input type="number" value={form.quantity}
                                    onChange={e => setForm({...form, quantity: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <input type="text" value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImages}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                            {previews.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {previews.map((src, i) => (
                                        <img key={i} src={src} alt=""
                                            className="w-20 h-20 object-cover rounded-lg border" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Sauvegarde...' : editing ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-6 py-2 border rounded-lg hover:bg-gray-100">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Image</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Nom</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Catégorie</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Prix</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Stock</th>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {product.images?.length > 0 ? (
                                        <img
                                            src={getImageUrl(product.images[0].image_url)}
                                            alt={product.name}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No img</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium">{product.name}</td>
                                <td className="px-6 py-4 text-gray-500">{product.category?.name}</td>
                                <td className="px-6 py-4 text-blue-600 font-semibold">
                                    {product.promotion_price || product.price} FCFA
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        product.quantity > 0
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {product.quantity} unités
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-800 text-sm">
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-800 text-sm">
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}