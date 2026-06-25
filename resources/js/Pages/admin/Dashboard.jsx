import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Package, Tag, ShoppingCart, Users, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0, categories: 0, orders: 0,
        users: 0, total_revenue: 0, pending_orders: 0,
        recent_orders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            label:   'Produits',
            value:   stats.products,
            icon:    <Package size={20} />,
            color:   'text-blue-600',
            bg:      'bg-blue-50',
            trend:   '+12%',
            trendUp: true,
        },
        {
            label:   'Catégories',
            value:   stats.categories,
            icon:    <Tag size={20} />,
            color:   'text-emerald-600',
            bg:      'bg-emerald-50',
            trend:   '+3%',
            trendUp: true,
        },
        {
            label:   'Commandes',
            value:   stats.orders,
            icon:    <ShoppingCart size={20} />,
            color:   'text-violet-600',
            bg:      'bg-violet-50',
            trend:   '+28%',
            trendUp: true,
        },
        {
            label:   'Clients',
            value:   stats.users,
            icon:    <Users size={20} />,
            color:   'text-amber-600',
            bg:      'bg-amber-50',
            trend:   '+5%',
            trendUp: true,
        },
        {
            label:   'Revenus',
            value:   `${Number(stats.total_revenue).toLocaleString()} FCFA`,
            icon:    <TrendingUp size={20} />,
            color:   'text-rose-600',
            bg:      'bg-rose-50',
            trend:   '+18%',
            trendUp: true,
        },
        {
            label:   'En attente',
            value:   stats.pending_orders,
            icon:    <Clock size={20} />,
            color:   'text-orange-600',
            bg:      'bg-orange-50',
            trend:   '-2%',
            trendUp: false,
        },
    ];

    const revenueData = [
        { mois: 'Jan', revenus: 0 },
        { mois: 'Fév', revenus: 0 },
        { mois: 'Mar', revenus: 0 },
        { mois: 'Avr', revenus: 0 },
        { mois: 'Mai', revenus: 0 },
        { mois: 'Jun', revenus: parseFloat(stats.total_revenue) },
    ];

    const ordersData = [
        { mois: 'Jan', commandes: 0 },
        { mois: 'Fév', commandes: 0 },
        { mois: 'Mar', commandes: 0 },
        { mois: 'Avr', commandes: 0 },
        { mois: 'Mai', commandes: 0 },
        { mois: 'Jun', commandes: stats.orders },
    ];

    const statusData = [
        { name: 'En attente',    value: stats.pending_orders || 0,                                              color: '#F59E0B' },
        { name: 'En traitement', value: Math.max(0, stats.orders - stats.pending_orders) || 0,                  color: '#6366F1' },
        { name: 'Livrées',       value: 0,                                                                      color: '#10B981' },
        { name: 'Annulées',      value: 0,                                                                      color: '#EF4444' },
    ].filter(d => d.value > 0);

    const statusColors = {
        pending:    'bg-amber-50 text-amber-700 border border-amber-200',
        processing: 'bg-violet-50 text-violet-700 border border-violet-200',
        shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
        delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
        cancelled:  'bg-red-50 text-red-700 border border-red-200',
    };

    const statusLabels = {
        pending:    'En attente',
        processing: 'En traitement',
        shipped:    'Expédié',
        delivered:  'Livré',
        cancelled:  'Annulé',
    };

    if (loading) return (
        <AdminLayout>
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-100 h-28 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-1">Vue d'ensemble de votre activité</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {cards.map(card => (
                    <div key={card.label} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${card.bg} ${card.color} p-2.5 rounded-lg`}>
                                {card.icon}
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-medium ${
                                card.trendUp ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                                <ArrowUpRight size={12} className={!card.trendUp ? 'rotate-180' : ''} />
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mb-1">{card.value}</p>
                        <p className="text-xs text-gray-400 tracking-wide uppercase">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-gray-900">Revenus mensuels</h2>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '8px', fontSize: '12px' }}
                                formatter={(value) => [`${value} FCFA`, 'Revenus']}
                            />
                            <Area type="monotone" dataKey="revenus" stroke="#6366F1" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-gray-900">Commandes mensuelles</h2>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">2026</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '8px', fontSize: '12px' }}
                                formatter={(value) => [value, 'Commandes']}
                            />
                            <Bar dataKey="commandes" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Statuts commandes</h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                    {statusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '8px', fontSize: '12px' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-44 text-gray-300">
                            <div className="text-center">
                                <ShoppingCart size={32} className="mx-auto mb-2" />
                                <p className="text-xs">Aucune donnée</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">Dernières commandes</h2>
                        <Link to="/admin/orders" className="text-xs text-violet-600 hover:text-violet-800 transition">
                            Voir tout →
                        </Link>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium tracking-wide uppercase">Commande</th>
                                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium tracking-wide uppercase">Client</th>
                                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium tracking-wide uppercase">Total</th>
                                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium tracking-wide uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recent_orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                                        Aucune commande récente
                                    </td>
                                </tr>
                            ) : stats.recent_orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.order_number}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-xs text-gray-600 font-medium">
                                                    {order.user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-700">{order.user?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {Number(order.total_amount).toLocaleString()} FCFA
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}