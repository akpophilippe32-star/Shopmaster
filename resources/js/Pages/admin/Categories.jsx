import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editing) {
                await api.put(`/categories/${editing}`, form);
            } else {
                await api.post('/categories', form);
            }
            setForm({ name: '', description: '' });
            setEditing(null);
            fetchCategories();
        } catch (e) {}
        setLoading(false);
    };

    const handleEdit = (cat) => {
        setEditing(cat.id);
        setForm({ name: cat.name, description: cat.description || '' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        await api.delete(`/categories/${id}`);
        fetchCategories();
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Catégories</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editing ? 'Modifier' : 'Ajouter'} une catégorie
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Sauvegarde...' : editing ? 'Modifier' : 'Ajouter'}
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-600 font-medium">Nom</th>
                                <th className="text-left px-6 py-3 text-gray-600 font-medium">Produits</th>
                                <th className="text-left px-6 py-3 text-gray-600 font-medium">Statut</th>
                                <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{cat.products_count || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            cat.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {cat.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}