import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import {
    LayoutDashboard, Package, Tag, ShoppingCart,
    Users, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch (e) {}
        logout();
        navigate('/login');
    };

    const links = [
        { path: '/admin',            label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
        { path: '/admin/products',   label: 'Produits',   icon: <Package size={18} />,      badge: null },
        { path: '/admin/categories', label: 'Catégories', icon: <Tag size={18} /> },
        { path: '/admin/orders',     label: 'Commandes',  icon: <ShoppingCart size={18} /> },
        { path: '/admin/clients',    label: 'Clients',    icon: <Users size={18} /> },
    ];

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-950 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-lg font-thin tracking-widest">
                                SHOP<span className="font-bold">MASTER</span>
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">Administration</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white transition p-1"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition group ${
                                location.pathname === link.path
                                    ? 'bg-white text-gray-900'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span className="flex-shrink-0">{link.icon}</span>
                            {sidebarOpen && (
                                <>
                                    <span className="text-sm flex-1">{link.label}</span>
                                    {location.pathname === link.path && (
                                        <ChevronRight size={14} />
                                    )}
                                </>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-800">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3 mb-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-900 text-xs font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <span className="text-gray-900 text-xs font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white py-2 rounded-lg text-xs transition"
                    >
                        <LogOut size={14} />
                        {sidebarOpen && 'Déconnexion'}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-400 capitalize">{today}</p>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            target="_blank"
                            className="text-xs text-gray-400 hover:text-gray-900 transition tracking-wide border border-gray-200 px-3 py-1.5 hover:border-gray-400"
                        >
                            Voir le site →
                        </Link>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}