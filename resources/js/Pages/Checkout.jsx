import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { ArrowRight, Lock } from 'lucide-react';

export default function Checkout() {
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        address: '',
        phone: user?.phone || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getImageUrl = (product) => {
        if (product.images?.length > 0) {
            const url = product.images[0].image_url;
            if (url.startsWith('http')) return url;
            return `http://127.0.0.1:8000/storage/${url}`;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/orders', form);
            clearCart();
            window.location.href = '/orders';
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la commande');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase mb-8">
                    <Link to="/" className="hover:text-gray-900">Accueil</Link>
                    <span>/</span>
                    <Link to="/cart" className="hover:text-gray-900">Panier</Link>
                    <span>/</span>
                    <span className="text-gray-600">Commande</span>
                </div>

                <h1 className="text-3xl font-thin text-gray-900 mb-10">Finaliser la commande</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-sm tracking-widest uppercase text-gray-900 mb-6">
                            Informations de livraison
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={user?.name}
                                    disabled
                                    className="w-full border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                    Adresse de livraison *
                                </label>
                                <textarea
                                    value={form.address}
                                    onChange={e => setForm({...form, address: e.target.value})}
                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                                    rows={3}
                                    placeholder="Rue, quartier, ville, pays..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                    Téléphone *
                                </label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition"
                                    placeholder="+229 XX XX XX XX"
                                    required
                                />
                            </div>

                            <div className="border border-gray-200 p-4 bg-gray-50">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Lock size={14} />
                                    <span>Vos informations sont sécurisées et cryptées</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Traitement...' : <>Confirmer la commande <ArrowRight size={16} /></>}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-sm tracking-widest uppercase text-gray-900 mb-6">
                            Récapitulatif ({items.length} articles)
                        </h2>

                        <div className="space-y-4 mb-6">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex gap-4 py-4 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
                                        {getImageUrl(product) ? (
                                            <img
                                                src={getImageUrl(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">
                                            {product.category?.name}
                                        </p>
                                        <p className="text-sm font-light text-gray-900 line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">Qté : {quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                                        {Number((product.promotion_price || product.price) * quantity).toLocaleString()} FCFA
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Sous-total</span>
                                <span>{Number(getTotal()).toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Livraison</span>
                                <span className="text-green-600">Gratuite</span>
                            </div>
                            <div className="flex justify-between font-medium text-gray-900 border-t pt-3">
                                <span className="tracking-widest uppercase text-sm">Total</span>
                                <span className="text-xl">{Number(getTotal()).toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}