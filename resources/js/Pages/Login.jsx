import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', form);
            setAuth(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
                    alt="ShopMaster"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-12">
                    <div>
                        <h2 className="text-4xl font-thin text-white mb-3">
                            SHOP<span className="font-bold">MASTER</span>
                        </h2>
                        <p className="text-gray-300 font-light text-lg">
                            L'excellence au service de vos envies.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="text-xl font-thin tracking-widest text-gray-900 mb-12 block lg:hidden">
                        SHOP<span className="font-bold">MASTER</span>
                    </Link>

                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Bienvenue</p>
                    <h1 className="text-3xl font-thin text-gray-900 mb-2">Connexion</h1>
                    <p className="text-gray-400 font-light mb-10">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-gray-900 underline hover:no-underline">
                            Créer un compte
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
                                Adresse email
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
                                Mot de passe
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

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-gray-900 transition tracking-wide">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-xs text-gray-400 tracking-wide">
                            En vous connectant, vous acceptez nos{' '}
                            <span className="underline cursor-pointer">conditions d'utilisation</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}