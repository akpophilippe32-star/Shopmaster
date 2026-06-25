import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import api from '../services/api';
import {
    ShoppingCart, User, LogOut, LayoutDashboard,
    ClipboardList, ChevronDown, Search, Menu, X
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const cartCount = useCartStore(state => state.getCount());
    const navigate = useNavigate();
    const [megaMenu, setMegaMenu] = useState(false);
    const [categories, setCategories] = useState([]);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        fetchCategories();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/tree');
            setCategories(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch (e) {}
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${search}`);
            setSearch('');
        }
    };

    const categoryIcons = {
        'Lunettes':   '👓',
        'Habits':     '👗',
        'Chaussures': '👠',
        'Parfums':    '🌸',
        'Sacs':       '👜',
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md' : 'bg-white'
            }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">

                        <Link to="/" className="text-xl font-thin tracking-widest text-gray-900">
                            SHOP<span className="font-bold">MASTER</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 tracking-wide transition">
                                Accueil
                            </Link>

                            <div
                                className="relative"
                                onMouseEnter={() => setMegaMenu(true)}
                                onMouseLeave={() => setMegaMenu(false)}
                            >
                                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 tracking-wide transition">
                                    Catégories <ChevronDown size={14} className={`transition-transform ${megaMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {megaMenu && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white shadow-2xl border border-gray-100 rounded-xl p-8 z-50">
                                        <div className="grid grid-cols-5 gap-6">
                                            {categories.map(cat => (
                                                <div key={cat.id} className="text-center">
                                                    <Link
                                                        to={`/products?category=${cat.id}`}
                                                        className="group block"
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-50 transition text-3xl">
                                                            {categoryIcons[cat.name] || '🛍️'}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition">
                                                            {cat.name}
                                                        </p>
                                                    </Link>
                                                    {cat.children?.length > 0 && (
                                                        <div className="mt-3 space-y-1">
                                                            {cat.children.slice(0, 4).map(child => (
                                                                <Link
                                                                    key={child.id}
                                                                    to={`/products?category=${child.id}`}
                                                                    className="block text-xs text-gray-500 hover:text-blue-600 transition py-0.5"
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t mt-6 pt-4 flex justify-center">
                                            <Link
                                                to="/products"
                                                className="text-sm text-blue-600 hover:text-blue-800 tracking-wide"
                                            >
                                                Voir tous les produits →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 tracking-wide transition">
                                Produits
                            </Link>
                        </div>

                        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-50 border rounded-lg px-4 py-2">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="bg-transparent text-sm outline-none w-40 text-gray-700"
                            />
                        </form>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 transition">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <p className="px-4 py-2 text-xs text-gray-400 border-b">{user.name}</p>
                                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <User size={14} /> Mon profil
                                        </Link>
                                        <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <ClipboardList size={14} /> Mes commandes
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-gray-50">
                                                <LayoutDashboard size={14} /> Administration
                                            </Link>
                                        )}
                                        <div className="border-t mt-1">
                                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 w-full">
                                                <LogOut size={14} /> Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 tracking-wide">
                                        Connexion
                                    </Link>
                                    <Link to="/register" className="bg-gray-900 text-white px-4 py-2 text-sm tracking-wide hover:bg-gray-700 transition rounded-lg">
                                        S'inscrire
                                    </Link>
                                </div>
                            )}

                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="md:hidden text-gray-600"
                            >
                                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenu && (
                    <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 border rounded-lg px-4 py-2">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="bg-transparent text-sm outline-none flex-1"
                            />
                        </form>
                        <Link to="/" className="block text-sm text-gray-700 py-2" onClick={() => setMobileMenu(false)}>Accueil</Link>
                        <Link to="/products" className="block text-sm text-gray-700 py-2" onClick={() => setMobileMenu(false)}>Produits</Link>
                        {categories.map(cat => (
                            <Link key={cat.id} to={`/products?category=${cat.id}`}
                                className="block text-sm text-gray-700 py-2"
                                onClick={() => setMobileMenu(false)}>
                                {categoryIcons[cat.name]} {cat.name}
                            </Link>
                        ))}
                        {!user && (
                            <>
                                <Link to="/login" className="block text-sm text-gray-700 py-2" onClick={() => setMobileMenu(false)}>Connexion</Link>
                                <Link to="/register" className="block text-sm text-gray-700 py-2" onClick={() => setMobileMenu(false)}>S'inscrire</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
            <div className="h-16"></div>
        </>
    );
}