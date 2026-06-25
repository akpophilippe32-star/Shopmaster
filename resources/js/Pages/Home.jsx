import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroLoaded, setHeroLoaded] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(0);  // ← ajoutez
    const totalVideos = 4;

    const addItem = useCartStore(state => state.addItem);
    const navigate = useNavigate();
    const heroRef = useRef(null);

    useEffect(() => {
        fetchData();
        setTimeout(() => setHeroLoaded(true), 100);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideo(prev => {
                const next = (prev + 1) % totalVideos;
                switchVideo(next);
                return next;
            });
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products', { params: { per_page: 8 } }),
                api.get('/categories'),
            ]);
            setProducts(productsRes.data.data || []);
            setCategories(categoriesRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        addItem(product);
        try {
            await api.post('/cart', { product_id: product.id, quantity: 1 });
        } catch (e) {}
    };

    const getImageUrl = (product) => {
        if (product.images?.length > 0) {
            const url = product.images[0].image_url;
            if (url.startsWith('http')) return url;
            return `http://127.0.0.1:8000/storage/${url}`;
        }
        return null;
    };

    const features = [
        { title: 'Qualité Premium', desc: 'Chaque produit est soigneusement sélectionné pour sa qualité exceptionnelle.' },
        { title: 'Livraison Rapide', desc: 'Recevez vos commandes en 24 à 48 heures partout au Bénin.' },
        { title: 'Paiement Sécurisé', desc: 'Transactions 100% sécurisées via Stripe et Mobile Money.' },
        { title: 'Service Client', desc: 'Notre équipe est disponible 7j/7 pour vous accompagner.' },
    ];
    const switchVideo = (index) => {
        for (let i = 0; i < totalVideos; i++) {
            const video = document.getElementById(`hero-video-${i}`);
            const bar   = document.getElementById(`hero-bar-${i}`);
            const label = document.getElementById(`hero-label-${i}`);
            if (video) video.style.opacity = i === index ? '1' : '0';
            if (bar) {
                bar.style.width           = i === index ? '2rem' : '1rem';
                bar.style.backgroundColor = i === index ? 'white' : 'rgba(255,255,255,0.4)';
            }
            if (label) {
                label.style.color = i === index ? 'white' : 'rgba(255,255,255,0.4)';
            }
        }
        setCurrentVideo(index);
    };
    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
                {[
                    { src: '/videos/video1.mp4', label: 'Lunettes' },
                    { src: '/videos/video2.mp4', label: 'Sacs' },
                    { src: '/videos/video3.mp4', label: 'Parfums' },
                    { src: '/videos/video4.mp4', label: 'Chaussures' },
                ].map((video, i) => (
                    <video
                        key={i}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                        style={{
                            filter:  'brightness(0.5)',
                            opacity: i === 0 ? 1 : 0,
                        }}
                        id={`hero-video-${i}`}
                    >
                        <source src={video.src} type="video/mp4" />
                    </video>
                ))}

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

                <div
                    className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6"
                    style={{
                        opacity:    heroLoaded ? 1 : 0,
                        transform:  heroLoaded ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 1.2s ease-out 0.5s',
                    }}
                >
                    <p className="text-xs tracking-[0.6em] text-gray-300 uppercase mb-6 font-light">
                        Collection Exclusive 2026
                    </p>
                    <h1 className="text-7xl lg:text-9xl font-thin tracking-tight mb-6 leading-none">
                        SHOP
                        <span className="font-black"> MASTER</span>
                    </h1>
                    <p className="text-gray-300 text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
                        L'art du commerce en ligne. Des produits d'exception sélectionnés pour ceux qui exigent le meilleur.
                    </p>
                    <div className="flex gap-6 justify-center mb-16">
                        <Link
                            to="/products"
                            className="border border-white text-white px-12 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500"
                        >
                            Découvrir
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-black px-12 py-4 text-sm tracking-widest uppercase hover:bg-gray-100 transition-all duration-300"
                        >
                            Rejoindre
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {['Lunettes', 'Sacs', 'Parfums', 'Chaussures'].map((label, i) => (
                            <button
                                key={i}
                                id={`hero-dot-${i}`}
                                onClick={() => switchVideo(i)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div id={`hero-bar-${i}`} className={`h-px transition-all duration-500 ${
                                    i === 0 ? 'w-8 bg-white' : 'w-4 bg-white/40'
                                }`}></div>
                                <span className={`text-xs tracking-widest uppercase transition-all duration-300 ${
                                    i === 0 ? 'text-white' : 'text-white/40'
                                }`} id={`hero-label-${i}`}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-px h-10 bg-white opacity-40 animate-bounce"></div>
                    <p className="text-white text-xs tracking-[0.4em] opacity-40 uppercase">Scroll</p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-32 px-6 max-w-5xl mx-auto text-center">
                <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-6">Notre Histoire</p>
                <h2 className="text-4xl lg:text-5xl font-thin text-gray-900 mb-8 leading-tight">
                    L'excellence au service<br />
                    <span className="font-bold">de vos envies</span>
                </h2>
                <p className="text-gray-500 text-lg font-light leading-relaxed max-w-3xl mx-auto mb-16">
                    ShopMaster est né d'une passion pour la qualité et l'élégance. Nous sélectionnons chaque produit avec soin pour vous offrir une expérience d'achat unique, alliant raffinement et accessibilité.
                </p>
                <div className="grid grid-cols-3 gap-12 border-t border-gray-100 pt-16">
                    {[
                        { number: '500+', label: 'Produits sélectionnés' },
                        { number: '2K+', label: 'Clients satisfaits' },
                        { number: '100%', label: 'Satisfaction garantie' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-5xl font-thin text-gray-900 mb-2">{stat.number}</p>
                            <p className="text-sm tracking-widest text-gray-400 uppercase">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-4">Explorer</p>
                            <h2 className="text-4xl font-thin text-gray-900">
                                Nos <span className="font-bold">Collections</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.map((cat, i) => (
                                <Link
                                    key={cat.id}
                                    to={`/products?category=${cat.id}`}
                                    className="group relative overflow-hidden aspect-square flex items-end p-8 hover:opacity-90 transition"
                                >
                                    {cat.image && cat.image.startsWith('http') ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                    <div className="relative z-10">
                                        <p className="text-xs tracking-widest text-gray-300 uppercase mb-2">
                                            {cat.products_count || 0} produits
                                        </p>
                                        <h3 className="text-2xl font-light text-white mb-3">{cat.name}</h3>
                                        <span className="text-white text-sm tracking-widest uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                                            Explorer <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products */}
            <section className="py-32 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-4">Sélection</p>
                    <h2 className="text-4xl font-thin text-gray-900">
                        Produits <span className="font-bold">Populaires</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-100 aspect-square mb-4"></div>
                                <div className="bg-gray-100 h-4 mb-2"></div>
                                <div className="bg-gray-100 h-4 w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg font-light">Aucun produit disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {products.map(product => (
                            <div key={product.id} className="group cursor-pointer">
                                <div
                                    className="relative overflow-hidden bg-gray-50 aspect-square mb-4"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    {getImageUrl(product) ? (
                                        <img
                                            src={getImageUrl(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <span className="text-gray-300 text-sm tracking-widest uppercase">Image</span>
                                        </div>
                                    )}
                                    {product.promotion_price && (
                                        <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 tracking-widest uppercase">
                                            Promo
                                        </span>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                        className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={14} />
                                        Ajouter au panier
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{product.category?.name}</p>
                                <h3 className="text-gray-900 font-light mb-2">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        {product.promotion_price ? (
                                            <div className="flex items-center gap-2">
                                                <p className="text-gray-900 font-medium">{product.promotion_price} FCFA</p>
                                                <p className="text-gray-400 text-sm line-through">{product.price} FCFA</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-900 font-medium">{product.price} FCFA</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-16">
                    <Link
                        to="/products"
                        className="border border-gray-900 text-gray-900 px-12 py-4 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-3"
                    >
                        Voir toute la collection <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-900 py-24">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="text-center">
                            <div className="w-px h-8 bg-gray-600 mx-auto mb-6"></div>
                            <h3 className="text-white font-light tracking-widest uppercase text-sm mb-3">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 text-center px-6">
                <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-6">Rejoignez-nous</p>
                <h2 className="text-5xl font-thin text-gray-900 mb-6">
                    L'excellence<br />
                    <span className="font-bold">vous attend</span>
                </h2>
                <p className="text-gray-400 font-light mb-12 max-w-lg mx-auto">
                    Créez votre compte et accédez à une sélection exclusive de produits premium livrés directement chez vous.
                </p>
                <Link
                    to="/register"
                    className="bg-gray-900 text-white px-14 py-5 text-sm tracking-widest uppercase hover:bg-gray-700 transition-all duration-300 inline-flex items-center gap-3"
                >
                    Commencer maintenant <ArrowRight size={16} />
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-black text-gray-500 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <h3 className="text-white text-2xl font-thin tracking-widest mb-4">SHOP<span className="font-bold">MASTER</span></h3>
                            <p className="text-sm leading-relaxed max-w-xs">
                                Votre destination premium pour des produits d'exception. Qualité, élégance et service irréprochable.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white text-xs tracking-widest uppercase mb-6">Navigation</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/products" className="hover:text-white transition">Produits</Link></li>
                                <li><Link to="/cart" className="hover:text-white transition">Panier</Link></li>
                                <li><Link to="/orders" className="hover:text-white transition">Commandes</Link></li>
                                <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-xs tracking-widest uppercase mb-6">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li>contact@shopmaster.com</li>
                                <li>+229 XX XX XX XX</li>
                                <li>Cotonou, Bénin</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-xs">
                        <p>© 2026 ShopMaster. Tous droits réservés.</p>
                        <p className="tracking-widest uppercase">Premium E-Commerce</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}