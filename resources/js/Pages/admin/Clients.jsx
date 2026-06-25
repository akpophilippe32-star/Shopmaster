import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchClients(); }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/admin/clients');
            setClients(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.put(`/admin/clients/${id}/toggle`);
            fetchClients();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteClient = async (id) => {
        if (!confirm('Supprimer ce client ?')) return;
        try {
            await api.delete(`/admin/clients/${id}`);
            fetchClients();
            setSelected(null);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchClient = async (id) => {
        try {
            const res = await api.get(`/admin/clients/${id}`);
            setSelected(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Clients</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Chargement...</p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Client</th>
                                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Téléphone</th>
                                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Commandes</th>
                                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Statut</th>
                                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Aucun client
                                        </td>
                                    </tr>
                                ) : clients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {client.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{client.name}</p>
                                                    <p className="text-xs text-gray-500">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {client.phone || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                                {client.orders_count} commande(s)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                client.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {client.status === 'active' ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => fetchClient(client.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Détails
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(client.id)}
                                                    className="text-yellow-600 hover:text-yellow-800 text-sm"
                                                >
                                                    {client.status === 'active' ? 'Désactiver' : 'Activer'}
                                                </button>
                                                <button
                                                    onClick={() => deleteClient(client.id)}
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
                    )}
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    {selected ? (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-lg">
                                        {selected.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{selected.name}</p>
                                    <p className="text-sm text-gray-500">{selected.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Téléphone</span>
                                    <span className="font-medium">{selected.phone || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Statut</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        selected.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selected.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Inscription</span>
                                    <span className="font-medium">
                                        {new Date(selected.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Commandes</span>
                                    <span className="font-medium">{selected.orders?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total dépensé</span>
                                    <span className="font-medium text-blue-600">
                                        {selected.orders?.reduce((sum, o) => sum + parseFloat(o.total_amount), 0).toLocaleString()} FCFA
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Dernières commandes</p>
                                <div className="space-y-2">
                                    {selected.orders?.slice(0, 3).map(order => (
                                        <div key={order.id} className="flex justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                            <span className="font-mono">{order.order_number}</span>
                                            <span className="text-blue-600 font-medium">{order.total_amount} FCFA</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="w-full mt-4 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p className="text-4xl mb-2">👤</p>
                            <p className="text-sm">Cliquez sur "Détails" pour voir les informations d'un client</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}