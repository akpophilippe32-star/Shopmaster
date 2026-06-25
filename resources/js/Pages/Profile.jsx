import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { User, Mail, Phone, Lock, Check } from 'lucide-react';

export default function Profile() {
    const { user, setAuth } = useAuthStore();
    const [form, setForm] = useState({
        name:                  user?.name || '',
        email:                 user?.email || '',
        phone:                 user?.phone || '',
        password:              '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError('');
        try {
            const data = { name: form.name, email: form.email, phone: form.phone };
            if (form.password) {
                data.password = form.password;
                data.password_confirmation = form.password_confirmation;
            }
            const res = await api.put('/profile', data);
            setAuth(res.data, localStorage.getItem('token'));
            setSuccess(true);
            setForm(prev => ({ ...prev, password: '', password_confirmation: '' }));
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase mb-8">
                    <Link to="/" className="hover:text-gray-900">Accueil</Link>
                    <span>/</span>
                    <span className="text-gray-600">Mon profil</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-2xl font-thin">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <p className="font-light text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                            <span className={`text-xs px-3 py-1 mt-2 inline-block border ${
                                user?.role === 'admin'
                                    ? 'border-purple-200 text-purple-600 bg-purple-50'
                                    : 'border-gray-200 text-gray-500 bg-gray-50'
                            }`}>
                                {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {[
                                { id: 'profile', label: 'Informations', icon: <User size={14} /> },
                                { id: 'security', label: 'Sécurité', icon: <Lock size={14} /> },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition ${
                                        activeTab === tab.id
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="tracking-wide">{tab.label}</span>
                                </button>
                            ))}
                            <Link
                                to="/orders"
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                            >
                                <span>📦</span>
                                <span className="tracking-wide">Mes commandes</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="lg:col-span-3">
                        {success && (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 text-sm mb-6">
                                <Check size={16} />
                                Profil mis à jour avec succès !
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-sm tracking-widest uppercase text-gray-900 mb-8">
                                    Informations personnelles
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                            Adresse email
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                            placeholder="+229 XX XX XX XX"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-900 text-white px-10 py-3 text-sm tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-sm tracking-widest uppercase text-gray-900 mb-8">
                                    Changer le mot de passe
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            value={form.password}
                                            onChange={e => setForm({...form, password: e.target.value})}
                                            className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                            Confirmer le mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            value={form.password_confirmation}
                                            onChange={e => setForm({...form, password_confirmation: e.target.value})}
                                            className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500 space-y-1">
                                        <p>• Minimum 6 caractères</p>
                                        <p>• Utilisez des lettres, chiffres et symboles</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !form.password}
                                        className="bg-gray-900 text-white px-10 py-3 text-sm tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Mise à jour...' : 'Mettre à jour'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}