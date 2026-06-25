import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/orders/${id}/status`, { status });
            fetchOrders();
        } catch (e) {
            console.error(e);
        }
    };

    const statusColors = {
        pending:    'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped:    'bg-purple-100 text-purple-700',
        delivered:  'bg-green-100 text-green-700',
        cancelled:  'bg-red-100 text-red-700',
    };

    const statusLabels = {
        pending:    'En attente',
        processing: 'En traitement',
        shipped:    'Expédié',
        delivered:  'Livré',
        cancelled:  'Annulé',
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Commandes</h1>
            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            Aucune commande
                        </div>
                    ) : orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-mono font-semibold">{order.order_number}</p>
                                    <p className="text-sm text-gray-500">{order.user?.name} — {order.phone}</p>
                                    <p className="text-sm text-gray-400">{order.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600 text-lg">{order.total_amount} FCFA</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1 mb-4 border-t pt-3">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.product?.name} x{item.quantity}</span>
                                        <span>{item.subtotal} FCFA</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t pt-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {statusLabels[order.status]}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.payment_status === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {order.payment_status === 'paid' ? 'Payé' : 'Non payé'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Changer statut :</span>
                                    <select
                                        value={order.status}
                                        onChange={e => updateStatus(order.id, e.target.value)}
                                        className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="processing">En traitement</option>
                                        <option value="shipped">Expédié</option>
                                        <option value="delivered">Livré</option>
                                        <option value="cancelled">Annulé</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}