import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '',
        password_confirmation: '', phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/register', form);
            setAuth(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                    alt="ShopMaster"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-12">
                    <div>
                        <h2 className="text-4xl font-thin text-white mb-3">
                            SHOP<span className="font-bold">MASTER</span>
                        </h2>
                        <p className="text-gray-300 font-light text-lg">
                            Rejoignez des milliers de clients satisfaits.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="text-xl font-thin tracking-widest text-gray-900 mb-12 block lg:hidden">
                        SHOP<span className="font-bold">MASTER</span>
                    </Link>

                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Nouveau client</p>
                    <h1 className="text-3xl font-thin text-gray-900 mb-2">Créer un compte</h1>
                    <p className="text-gray-400 font-light mb-10">
                        Déjà client ?{' '}
                        <Link to="/login" className="text-gray-900 underline hover:no-underline">
                            Se connecter
                        </Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({...form, name: e.target.value})}
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                placeholder="Votre nom complet"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                Adresse email *
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                placeholder="votre@email.com"
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                    Mot de passe *
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({...form, password: e.target.value})}
                                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                                    Confirmer *
                                </label>
                                <input
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={e => setForm({...form, password_confirmation: e.target.value})}
                                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-900 transition bg-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-xs text-gray-400 tracking-wide">
                            En créant un compte, vous acceptez nos{' '}
                            <span className="underline cursor-pointer">conditions d'utilisation</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}