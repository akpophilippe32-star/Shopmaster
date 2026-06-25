import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const getImageUrl = (product) => {
        if (product.images?.length > 0) {
            const url = product.images[0].image_url;
            if (url.startsWith('http')) return url;
            return `http://127.0.0.1:8000/storage/${url}`;
        }
        return null;
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-2xl mx-auto px-6 py-32 text-center">
                    <ShoppingBag size={48} className="text-gray-200 mx-auto mb-6" />
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Votre panier</p>
                    <h1 className="text-3xl font-thin text-gray-900 mb-4">Votre panier est vide</h1>
                    <p className="text-gray-400 font-light mb-10">
                        Découvrez nos produits et ajoutez vos favoris au panier.
                    </p>
                    <Link
                        to="/products"
                        className="bg-gray-900 text-white px-12 py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition inline-flex items-center gap-3"
                    >
                        Continuer les achats <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase mb-8">
                    <Link to="/" className="hover:text-gray-900">Accueil</Link>
                    <span>/</span>
                    <span className="text-gray-600">Panier</span>
                </div>

                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-thin text-gray-900">
                        Mon Panier <span className="text-gray-400 text-2xl">({items.length})</span>
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-xs text-gray-400 tracking-widest uppercase hover:text-gray-900 transition"
                    >
                        Vider le panier
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="hidden md:grid grid-cols-12 gap-4 text-xs tracking-widest text-gray-400 uppercase pb-4 border-b mb-4">
                            <div className="col-span-6">Produit</div>
                            <div className="col-span-2 text-center">Prix</div>
                            <div className="col-span-2 text-center">Quantité</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        <div className="space-y-6">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100">
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
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
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="text-sm font-light text-gray-900 hover:underline line-clamp-2"
                                            >
                                                {product.name}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="text-gray-300 hover:text-gray-900 transition md:hidden"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="col-span-4 md:col-span-2 text-center">
                                        <p className="text-sm font-medium text-gray-900">
                                            {Number(product.promotion_price || product.price).toLocaleString()} FCFA
                                        </p>
                                        {product.promotion_price && (
                                            <p className="text-xs text-gray-400 line-through">
                                                {Number(product.price).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-span-5 md:col-span-2 flex justify-center">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                className="px-3 py-2 hover:bg-gray-50 transition"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="px-4 py-2 text-sm border-x border-gray-200 min-w-[40px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                className="px-3 py-2 hover:bg-gray-50 transition"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {Number((product.promotion_price || product.price) * quantity).toLocaleString()} FCFA
                                        </p>
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="text-gray-300 hover:text-gray-900 transition hidden md:block"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <Link
                                to="/products"
                                className="text-sm text-gray-400 tracking-widest uppercase hover:text-gray-900 transition flex items-center gap-2"
                            >
                                ← Continuer les achats
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-sm tracking-widest uppercase text-gray-900 mb-6">
                                Récapitulatif
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                                    <span>{Number(getTotal()).toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Livraison</span>
                                    <span className="text-green-600">Gratuite</span>
                                </div>
                                {items.some(i => i.product.promotion_price) && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Économies</span>
                                        <span>
                                            -{Number(items.reduce((s, i) => {
                                                if (i.product.promotion_price) {
                                                    return s + (i.product.price - i.product.promotion_price) * i.quantity;
                                                }
                                                return s;
                                            }, 0)).toLocaleString()} FCFA
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between font-medium text-gray-900">
                                    <span className="tracking-wide uppercase text-sm">Total</span>
                                    <span className="text-xl">{Number(getTotal()).toLocaleString()} FCFA</span>
                                </div>
                            </div>

                            <button
                                onClick={() => user ? navigate('/checkout') : navigate('/login')}
                                className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition flex items-center justify-center gap-3"
                            >
                                Commander <ArrowRight size={16} />
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400">
                                    🔒 Paiement sécurisé — Stripe & Mobile Money
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}