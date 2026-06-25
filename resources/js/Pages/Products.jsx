import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import { SlidersHorizontal, ChevronDown, ShoppingCart, Star, X } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const addItem = useCartStore(state => state.addItem);

    const [filters, setFilters] = useState({
        search:      searchParams.get('search') || '',
        category:    searchParams.get('category') || '',
        min_price:   '',
        max_price:   '',
        sort:        'newest',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts(1, true);
    }, [filters]);

    const fetchCategories = async () => {
        const res = await api.get('/categories/tree');
        setCategories(res.data);
    };

    const fetchProducts = async (pageNum = 1, reset = false) => {
        setLoading(true);
        try {
            const params = {
                page:       pageNum,
                per_page:   12,
                search:     filters.search,
                category_id: filters.category,
                min_price:  filters.min_price,
                max_price:  filters.max_price,
            };

            if (filters.sort === 'price_asc')  params.sort = 'price_asc';
            if (filters.sort === 'price_desc') params.sort = 'price_desc';
            if (filters.sort === 'promo')      params.promo = 1;

            const res = await api.get('/products', { params });
            const newProducts = res.data.data || [];

            if (reset) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }

            setTotal(res.data.total || 0);
            setHasMore(pageNum < (res.data.last_page || 1));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage);
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

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', min_price: '', max_price: '', sort: 'newest' });
    };

    const activeFiltersCount = [
        filters.category, filters.min_price, filters.max_price
    ].filter(Boolean).length;

    const sortOptions = [
        { value: 'newest',     label: 'Nouveautés' },
        { value: 'price_asc',  label: 'Prix croissant' },
        { value: 'price_desc', label: 'Prix décroissant' },
        { value: 'promo',      label: 'Promotions' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                        ShopMaster / Produits
                    </p>
                    <h1 className="text-3xl font-thin text-gray-900">
                        {filters.category ? (
                            categories.flatMap(c => [c, ...(c.children || [])]).find(c => c.id == filters.category)?.name || 'Produits'
                        ) : 'Tous les produits'}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">{total} produits trouvés</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm hover:border-gray-900 transition"
                        >
                            <SlidersHorizontal size={16} />
                            Filtres
                            {activeFiltersCount > 0 && (
                                <span className="bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => updateFilter('category', filters.category == cat.id ? '' : cat.id)}
                                className={`text-sm px-4 py-2 border transition ${
                                    filters.category == cat.id
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'border-gray-300 hover:border-gray-900'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}

                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900">
                                <X size={14} /> Effacer
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Trier par</span>
                        <select
                            value={filters.sort}
                            onChange={e => updateFilter('sort', e.target.value)}
                            className="border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:border-gray-900"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {showFilters && (
                    <div className="border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3 tracking-wide uppercase">Sous-catégories</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {categories.flatMap(cat => cat.children || []).map(child => (
                                    <label key={child.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category == child.id}
                                            onChange={() => updateFilter('category', child.id)}
                                            className="accent-gray-900"
                                        />
                                        <span className="text-sm text-gray-600">{child.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3 tracking-wide uppercase">Prix (FCFA)</p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.min_price}
                                    onChange={e => updateFilter('min_price', e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                />
                                <span className="text-gray-400">—</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.max_price}
                                    onChange={e => updateFilter('max_price', e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3 tracking-wide uppercase">Disponibilité</p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="accent-gray-900" />
                                    <span className="text-sm text-gray-600">En stock</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="accent-gray-900" />
                                    <span className="text-sm text-gray-600">En promotion</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {loading && products.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-100 aspect-square mb-3"></div>
                                <div className="bg-gray-100 h-3 mb-2 w-3/4"></div>
                                <div className="bg-gray-100 h-3 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-lg font-light mb-4">Aucun produit trouvé</p>
                        <button onClick={clearFilters} className="border border-gray-900 px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition">
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="group cursor-pointer">
                                    <Link to={`/products/${product.id}`}>
                                        <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3">
                                            {getImageUrl(product) ? (
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-300 text-xs tracking-widest uppercase">Image</span>
                                                </div>
                                            )}
                                            {product.promotion_price && (
                                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 tracking-wide">
                                                    -{Math.round((1 - product.promotion_price / product.price) * 100)}%
                                                </span>
                                            )}
                                            {product.quantity === 0 && (
                                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                                    <span className="text-xs tracking-widest uppercase text-gray-500">Rupture de stock</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{product.category?.name}</p>
                                    <Link to={`/products/${product.id}`}>
                                        <h3 className="text-sm text-gray-900 font-light mb-2 line-clamp-2 hover:underline">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {product.promotion_price ? (
                                                <div>
                                                    <span className="text-gray-900 font-medium text-sm">{Number(product.promotion_price).toLocaleString()} FCFA</span>
                                                    <span className="text-gray-400 text-xs line-through ml-2">{Number(product.price).toLocaleString()} FCFA</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-900 font-medium text-sm">{Number(product.price).toLocaleString()} FCFA</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.quantity === 0}
                                            className="bg-gray-900 text-white p-2 hover:bg-gray-700 transition disabled:opacity-30"
                                        >
                                            <ShoppingCart size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <div className="text-center mt-16">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="border border-gray-900 text-gray-900 px-12 py-4 text-sm tracking-widest uppercase hover:bg-gray-900 hover:text-white transition disabled:opacity-50"
                                >
                                    {loading ? 'Chargement...' : 'Voir plus de produits'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}