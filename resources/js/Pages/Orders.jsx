import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Package, ArrowRight } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        pending:    { label: 'En attente',    color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        processing: { label: 'En traitement', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        shipped:    { label: 'Expédié',       color: 'bg-purple-50 text-purple-700 border-purple-200' },
        delivered:  { label: 'Livré',         color: 'bg-green-50 text-green-700 border-green-200' },
        cancelled:  { label: 'Annulé',        color: 'bg-red-50 text-red-700 border-red-200' },
    };

    const getImageUrl = (item) => {
        if (item.product?.images?.length > 0) {
            const url = item.product.images[0].image_url;
            if (url.startsWith('http')) return url;
            return `http://127.0.0.1:8000/storage/${url}`;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase mb-8">
                    <Link to="/" className="hover:text-gray-900">Accueil</Link>
                    <span>/</span>
                    <span className="text-gray-600">Mes commandes</span>
                </div>

                <h1 className="text-3xl font-thin text-gray-900 mb-10">Mes Commandes</h1>

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse border border-gray-100 p-6">
                                <div className="bg-gray-100 h-4 w-1/4 mb-4"></div>
                                <div className="bg-gray-100 h-4 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24">
                        <Package size={48} className="text-gray-200 mx-auto mb-6" />
                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Aucune commande</p>
                        <h2 className="text-2xl font-thin text-gray-900 mb-4">
                            Vous n'avez pas encore commandé
                        </h2>
                        <p className="text-gray-400 font-light mb-10">
                            Découvrez nos produits et passez votre première commande.
                        </p>
                        <Link
                            to="/products"
                            className="bg-gray-900 text-white px-12 py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition inline-flex items-center gap-3"
                        >
                            Découvrir les produits <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="border border-gray-100 hover:border-gray-300 transition">
                                <div className="flex justify-between items-start p-6 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">
                                            Commande
                                        </p>
                                        <p className="font-mono text-sm text-gray-900">{order.order_number}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-light text-gray-900">
                                            {Number(order.total_amount).toLocaleString()} FCFA
                                        </p>
                                        <div className="flex gap-2 mt-2 justify-end">
                                            <span className={`text-xs px-3 py-1 border ${statusConfig[order.status]?.color}`}>
                                                {statusConfig[order.status]?.label}
                                            </span>
                                            <span className={`text-xs px-3 py-1 border ${
                                                order.payment_status === 'paid'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {order.payment_status === 'paid' ? 'Payé' : 'Non payé'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex gap-3 mb-4">
                                        {order.items?.slice(0, 4).map(item => (
                                            <div key={item.id} className="w-14 h-14 bg-gray-50 flex-shrink-0 overflow-hidden">
                                                {getImageUrl(item) ? (
                                                    <img
                                                        src={getImageUrl(item)}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100" />
                                                )}
                                            </div>
                                        ))}
                                        {order.items?.length > 4 && (
                                            <div className="w-14 h-14 bg-gray-50 flex items-center justify-center">
                                                <span className="text-xs text-gray-400">+{order.items.length - 4}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-500">
                                                <span className="font-light">{item.product?.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                                <span>{Number(item.subtotal).toLocaleString()} FCFA</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {order.payment_status !== 'paid' && (
                                    <div className="px-6 pb-6">
                                        <button
                                            onClick={() => navigate('/payment', { state: { order } })}
                                            className="w-full border border-gray-900 text-gray-900 py-3 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition flex items-center justify-center gap-3"
                                        >
                                            Payer maintenant <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}