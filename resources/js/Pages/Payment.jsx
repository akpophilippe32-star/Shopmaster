import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { CreditCard, Smartphone, CheckCircle } from 'lucide-react';

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [mobileForm, setMobileForm] = useState({
        phone: '', operator: 'mtn'
    });

    useEffect(() => {
        if (!order) navigate('/orders');
    }, [order]);

    const handleCardPayment = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/payments/confirm', {
                order_id:       order.id,
                transaction_id: 'pi_test_' + Math.random().toString(36).substr(2, 9),
                method:         'card',
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de paiement');
        } finally {
            setLoading(false);
        }
    };

    const handleMobileMoneyPayment = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/payments/mobile-money', {
                order_id: order.id,
                phone:    mobileForm.phone,
                operator: mobileForm.operator,
            });
            alert(res.data.instructions);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de paiement');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-lg mx-auto px-6 py-20 text-center">
                    <div className="bg-white rounded-xl shadow p-10">
                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Paiement réussi !
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Votre commande {order.order_number} a été confirmée.
                        </p>
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
                        >
                            Voir mes commandes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Paiement</h1>

                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-mono text-sm text-gray-500">{order?.order_number}</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                {order?.total_amount} FCFA
                            </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            En attente de paiement
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>
                )}

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Choisir le mode de paiement</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => setMethod('card')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                                method === 'card'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <CreditCard size={24} className={method === 'card' ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`font-medium ${method === 'card' ? 'text-blue-600' : 'text-gray-600'}`}>
                                Carte bancaire
                            </span>
                        </button>
                        <button
                            onClick={() => setMethod('mobile_money')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                                method === 'mobile_money'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <Smartphone size={24} className={method === 'mobile_money' ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`font-medium ${method === 'mobile_money' ? 'text-blue-600' : 'text-gray-600'}`}>
                                Mobile Money
                            </span>
                        </button>
                    </div>

                    {method === 'card' && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                                <p className="font-medium text-gray-700 mb-2">Carte de test Stripe :</p>
                                <p>Numéro : <span className="font-mono">4242 4242 4242 4242</span></p>
                                <p>Expiration : <span className="font-mono">12/28</span></p>
                                <p>CVC : <span className="font-mono">123</span></p>
                            </div>
                            <button
                                onClick={handleCardPayment}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                {loading ? 'Traitement...' : `Payer ${order?.total_amount} FCFA`}
                            </button>
                        </div>
                    )}

                    {method === 'mobile_money' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-1">Opérateur</label>
                                <select
                                    value={mobileForm.operator}
                                    onChange={e => setMobileForm({...mobileForm, operator: e.target.value})}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="mtn">MTN Mobile Money</option>
                                    <option value="moov">Moov Money</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Numéro de téléphone</label>
                                <input
                                    type="text"
                                    value={mobileForm.phone}
                                    onChange={e => setMobileForm({...mobileForm, phone: e.target.value})}
                                    placeholder="+229 XX XX XX XX"
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleMobileMoneyPayment}
                                disabled={loading || !mobileForm.phone}
                                className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                            >
                                <Smartphone size={20} />
                                {loading ? 'Traitement...' : `Payer ${order?.total_amount} FCFA`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}