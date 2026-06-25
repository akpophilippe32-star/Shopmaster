import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus, Check } from 'lucide-react';


function ReviewSection({ productId, user }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [total, setTotal] = useState(0);
    const [form, setForm] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/products/${productId}/reviews`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avg_rating);
            setTotal(res.data.total);
        } catch (e) {}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/reviews', {
                product_id: productId,
                rating:     form.rating,
                comment:    form.comment,
            });
            setForm({ rating: 5, comment: '' });
            setShowForm(false);
            fetchReviews();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/reviews/${id}`);
            fetchReviews();
        } catch (e) {}
    };

    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <span className="text-4xl font-thin text-gray-900">{avgRating || 0}</span>
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.round(avgRating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-200 fill-gray-200'
                                    }
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">{total} avis</p>
                    </div>
                </div>
                {user && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="border border-gray-900 text-gray-900 px-6 py-2 text-xs tracking-widest uppercase hover:bg-gray-900 hover:text-white transition"
                    >
                        {showForm ? 'Annuler' : 'Laisser un avis'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="border border-gray-200 p-6 mb-8">
                    <h3 className="text-sm tracking-widest uppercase text-gray-700 mb-4">Votre avis</h3>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm mb-4">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Note</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setForm({...form, rating: star})}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={24}
                                            className={star <= form.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300 fill-gray-300'
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Commentaire</p>
                            <textarea
                                value={form.comment}
                                onChange={e => setForm({...form, comment: e.target.value})}
                                rows={4}
                                placeholder="Partagez votre expérience avec ce produit..."
                                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : 'Publier l\'avis'}
                        </button>
                    </form>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200">
                    <Star size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-light">Aucun avis pour ce produit</p>
                    <p className="text-xs text-gray-300 mt-1">Soyez le premier à partager votre expérience</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-medium">
                                            {review.user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{review.user?.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i < review.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-200 fill-gray-200'
                                                }
                                            />
                                        ))}
                                    </div>
                                    {user?.id === review.user_id && (
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="text-xs text-red-400 hover:text-red-600 transition"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-600 font-light leading-relaxed ml-12">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const addItem = useCartStore(state => state.addItem);

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setSelectedImage(0);

            const related = await api.get('/products', {
                params: { category_id: res.data.category_id, per_page: 4 }
            });
            setRelated(related.data.data?.filter(p => p.id != id) || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://127.0.0.1:8000/storage/${url}`;
    };

    const handleAddToCart = async () => {
        addItem(product, quantity);
        try {
            await api.post('/cart', { product_id: product.id, quantity });
        } catch (e) {}
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-2 gap-16 animate-pulse">
                    <div className="bg-gray-100 aspect-square"></div>
                    <div className="space-y-4">
                        <div className="bg-gray-100 h-6 w-1/3"></div>
                        <div className="bg-gray-100 h-10 w-2/3"></div>
                        <div className="bg-gray-100 h-4 w-full"></div>
                        <div className="bg-gray-100 h-4 w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return null;

    const images = product.images?.length > 0
        ? product.images
        : [{ image_url: null }];

    const effectivePrice = product.promotion_price || product.price;
    const discount = product.promotion_price
        ? Math.round((1 - product.promotion_price / product.price) * 100)
        : null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase mb-8">
                    <Link to="/" className="hover:text-gray-900">Accueil</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-gray-900">Produits</Link>
                    <span>/</span>
                    <span className="text-gray-600">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    <div className="space-y-4">
                        <div className="relative overflow-hidden bg-gray-50 aspect-square">
                            {getImageUrl(images[selectedImage]?.image_url) ? (
                                <img
                                    src={getImageUrl(images[selectedImage]?.image_url)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-300 tracking-widest uppercase text-sm">Image</span>
                                </div>
                            )}
                            {discount && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 tracking-wide">
                                    -{discount}%
                                </span>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 overflow-hidden border-2 transition ${
                                            selectedImage === i ? 'border-gray-900' : 'border-transparent'
                                        }`}
                                    >
                                        {getImageUrl(img.image_url) ? (
                                            <img
                                                src={getImageUrl(img.image_url)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:py-4">
                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
                            {product.category?.name}
                        </p>
                        <h1 className="text-3xl font-thin text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-400 ml-1">
                                ({product.reviews?.length || 0} avis)
                            </span>
                        </div>

                        <div className="mb-8">
                            {product.promotion_price ? (
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-light text-gray-900">
                                        {Number(product.promotion_price).toLocaleString()} FCFA
                                    </span>
                                    <span className="text-xl text-gray-400 line-through">
                                        {Number(product.price).toLocaleString()} FCFA
                                    </span>
                                    <span className="bg-red-100 text-red-600 text-sm px-2 py-1">
                                        Économie : {Number(product.price - product.promotion_price).toLocaleString()} FCFA
                                    </span>
                                </div>
                            ) : (
                                <span className="text-3xl font-light text-gray-900">
                                    {Number(product.price).toLocaleString()} FCFA
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <p className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.quantity > 0 ? `✓ En stock (${product.quantity} disponibles)` : '✗ Rupture de stock'}
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm text-gray-500 tracking-wide uppercase mb-3">Quantité</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="px-4 py-3 hover:bg-gray-50 transition"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="px-6 py-3 text-sm font-medium border-x border-gray-300">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                                        className="px-4 py-3 hover:bg-gray-50 transition"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.quantity === 0}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm tracking-widest uppercase transition ${
                                    added
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-900 text-white hover:bg-gray-700'
                                } disabled:opacity-30`}
                            >
                                {added ? (
                                    <><Check size={16} /> Ajouté au panier</>
                                ) : (
                                    <><ShoppingCart size={16} /> Ajouter au panier</>
                                )}
                            </button>
                            <button className="border border-gray-300 px-4 py-4 hover:border-gray-900 transition">
                                <Heart size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                handleAddToCart();
                                setTimeout(() => navigate('/checkout'), 500);
                            }}
                            disabled={product.quantity === 0}
                            className="w-full border border-gray-900 text-gray-900 py-4 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition disabled:opacity-30 mb-8"
                        >
                            Acheter maintenant
                        </button>

                        <div className="border-t pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>🚚</span>
                                <span>Livraison rapide 24-48h au Bénin</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>🔒</span>
                                <span>Paiement 100% sécurisé</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>↩️</span>
                                <span>Retour gratuit sous 30 jours</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <div className="flex border-b mb-8">
                        {['description', 'details', 'avis'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-sm tracking-widest uppercase transition ${
                                    activeTab === tab
                                        ? 'border-b-2 border-gray-900 text-gray-900'
                                        : 'text-gray-400 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'description' ? 'Description' : tab === 'details' ? 'Détails' : 'Avis clients'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'avis' && (
                        <ReviewSection
                            productId={product.id}
                            user={user}
                        />
                    )}
                    {activeTab === 'details' && (
                        <div className="max-w-lg">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { label: 'Référence',  value: `SM-${product.id.toString().padStart(5, '0')}` },
                                        { label: 'Catégorie',  value: product.category?.name },
                                        { label: 'Stock',      value: `${product.quantity} unités` },
                                        { label: 'Statut',     value: product.status === 'active' ? 'Disponible' : 'Indisponible' },
                                    ].map(row => (
                                        <tr key={row.label}>
                                            <td className="py-3 text-gray-400 tracking-wide uppercase text-xs w-32">{row.label}</td>
                                            <td className="py-3 text-gray-900">{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'avis' && (
                        <div className="max-w-2xl">
                            {product.reviews?.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 font-light mb-4">Aucun avis pour ce produit</p>
                                    {user && (
                                        <button className="border border-gray-900 px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition">
                                            Laisser un avis
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {product.reviews?.map(review => (
                                        <div key={review.id} className="border-b pb-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">{review.user?.name?.charAt(0)}</span>
                                                </div>
                                                <span className="font-medium text-sm">{review.user?.name}</span>
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm font-light">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {related.length > 0 && (
                    <div>
                        <div className="text-center mb-10">
                            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Vous aimerez aussi</p>
                            <h2 className="text-2xl font-thin text-gray-900">Produits similaires</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {related.map(product => (
                                <Link key={product.id} to={`/products/${product.id}`} className="group">
                                    <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3">
                                        {getImageUrl(product.images?.[0]?.image_url) ? (
                                            <img
                                                src={getImageUrl(product.images[0].image_url)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{product.category?.name}</p>
                                    <h3 className="text-sm font-light text-gray-900 line-clamp-2">{product.name}</h3>
                                    <p className="text-sm font-medium mt-1">
                                        {Number(product.promotion_price || product.price).toLocaleString()} FCFA
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}