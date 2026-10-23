import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { CreditCard, Smartphone, CheckCircle } from 'lucide-react';

const stripePromise = import.meta.env.VITE_STRIPE_KEY
    ? loadStripe(import.meta.env.VITE_STRIPE_KEY)
    : null;

function CardPaymentForm({ order, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || loading) return;

        setLoading(true);
        setError('');

        try {
            const { error: submitError } = await elements.submit();

            if (submitError) {
                setError(submitError.message || 'Vérifie les informations de ta carte.');
                return;
            }

            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            });

            if (result.error) {
                setError(result.error.message || 'Le paiement a échoué.');
                return;
            }

            const intent = result.paymentIntent;

            if (!intent || intent.status !== 'succeeded') {
                setError(
                    'Le paiement n’est pas encore confirmé. Vérifie son état avant de réessayer.'
                );
                return;
            }

            // Le serveur vérifie lui-même le véritable PaymentIntent auprès de Stripe.
            await api.post('/payments/confirm', {
                order_id: order.id,
                transaction_id: intent.id,
            });

            onSuccess();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Impossible de confirmer le paiement. Vérifie tes commandes avant de réessayer.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border border-gray-200 p-4">
                <PaymentElement />
            </div>

            {error && (
                <div role="alert" className="bg-red-100 text-red-700 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
                <CreditCard size={20} />
                {loading ? 'Vérification du paiement...' : `Payer ${order.total_amount} FCFA`}
            </button>

            <p className="text-xs text-gray-500 text-center">
                Les informations de carte sont saisies dans le formulaire sécurisé de Stripe.
            </p>
        </form>
    );
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    const [method, setMethod] = useState('card');
    const [clientSecret, setClientSecret] = useState('');
    const [loadingIntent, setLoadingIntent] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!order) {
            navigate('/orders', { replace: true });
        }
    }, [order, navigate]);

    useEffect(() => {
        if (!order?.id || !stripePromise) return;

        let active = true;

        const createIntent = async () => {
            setLoadingIntent(true);
            setError('');
            setClientSecret('');

            try {
                const response = await api.post('/payments/intent', {
                    order_id: order.id,
                });

                if (active) {
                    setClientSecret(response.data.client_secret || '');
                    if (!response.data.client_secret) {
                        setError('Stripe n’a pas retourné de secret de paiement.');
                    }
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        'Impossible de préparer le paiement.'
                    );
                }
            } finally {
                if (active) setLoadingIntent(false);
            }
        };

        createIntent();

        return () => {
            active = false;
        };
    }, [order?.id]);

    if (!order) return null;

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-lg mx-auto px-6 py-20 text-center">
                    <div className="bg-white rounded-xl shadow p-10">
                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Paiement confirmé !
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Le serveur a vérifié le paiement de votre commande{' '}
                            {order.order_number}.
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
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Paiement
                </h1>

                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <p className="font-mono text-sm text-gray-500">
                                {order.order_number}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                {order.total_amount} FCFA
                            </p>
                        </div>

                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            En attente
                        </span>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Choisir le mode de paiement
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setMethod('card')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                                method === 'card'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <CreditCard
                                size={24}
                                className={method === 'card' ? 'text-blue-600' : 'text-gray-400'}
                            />
                            <span className="font-medium">Carte bancaire</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod('mobile_money')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                                method === 'mobile_money'
                                    ? 'border-gray-400 bg-gray-50'
                                    : 'border-gray-200'
                            }`}
                        >
                            <Smartphone size={24} className="text-gray-400" />
                            <span className="font-medium">Mobile Money</span>
                        </button>
                    </div>

                    {method === 'card' && (
                        <div className="space-y-4">
                            {!stripePromise && (
                                <p role="alert" className="text-red-600">
                                    La clé publique Stripe manque dans la configuration du site.
                                </p>
                            )}

                            {stripePromise && loadingIntent && (
                                <p className="text-gray-500">
                                    Préparation du formulaire de paiement...
                                </p>
                            )}

                            {stripePromise && clientSecret && (
                                <Elements
                                    stripe={stripePromise}
                                    options={{ clientSecret }}
                                >
                                    <CardPaymentForm
                                        order={order}
                                        onSuccess={() => setSuccess(true)}
                                    />
                                </Elements>
                            )}

                            {stripePromise && !loadingIntent && !clientSecret && !error && (
                                <p className="text-gray-500">
                                    Le formulaire de paiement n’est pas disponible.
                                </p>
                            )}
                        </div>
                    )}

                    {method === 'mobile_money' && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                            <p className="font-semibold text-yellow-900">
                                Mobile Money momentanément indisponible
                            </p>
                            <p className="text-sm text-yellow-800 mt-2">
                                Ce mode de paiement sera disponible après l’intégration
                                d’un véritable prestataire. Aucun paiement ne sera simulé.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
