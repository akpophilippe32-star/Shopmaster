<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Stripe\StripeClient;
use App\Mail\OrderConfirmed;

class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($data['order_id']);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Cette commande est déjà payée.',
            ], 409);
        }

        if (!is_numeric($order->total_amount)
            || (float) $order->total_amount <= 0
            || (float) $order->total_amount != (int) $order->total_amount) {
            return response()->json([
                'message' => 'Le montant de la commande est invalide.',
            ], 422);
        }

        $secret = config('services.stripe.secret');

        if (!$secret) {
            return response()->json([
                'message' => 'Le paiement par carte est momentanément indisponible.',
            ], 503);
        }

        try {
            $stripe = new StripeClient($secret);

            $intent = $stripe->paymentIntents->create([
                'amount' => (int) $order->total_amount,
                'currency' => 'xof',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'order_id' => (string) $order->id,
                    'user_id' => (string) $request->user()->id,
                ],
            ], [
                'idempotency_key' => 'order-' . $order->id
                    . '-attempt-' . bin2hex(random_bytes(8)),
            ]);

            return response()->json([
                'client_secret' => $intent->client_secret,
                'order' => $order,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Impossible d’initialiser le paiement. Réessaie plus tard.',
            ], 502);
        }
    }

    public function confirm(Request $request)
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'transaction_id' => ['required', 'string', 'starts_with:pi_'],
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($data['order_id']);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Cette commande est déjà payée.',
                'order' => $order,
            ], 409);
        }

        $secret = config('services.stripe.secret');

        if (!$secret) {
            return response()->json([
                'message' => 'Le paiement est momentanément indisponible.',
            ], 503);
        }

        try {
            $stripe = new StripeClient($secret);
            $intent = $stripe->paymentIntents->retrieve(
                $data['transaction_id'],
                []
            );

            if (
                $intent->status !== 'succeeded'
                || (string) $intent->metadata->order_id !== (string) $order->id
                || (string) $intent->metadata->user_id !== (string) $request->user()->id
                || $intent->currency !== 'xof'
                || (int) $intent->amount !== (int) $order->total_amount
                || (int) $intent->amount_received !== (int) $order->total_amount
            ) {
                return response()->json([
                    'message' => 'Le paiement n’a pas pu être vérifié.',
                ], 422);
            }

            $alreadyProcessed = Payment::where(
                'transaction_id',
                $intent->id
            )->exists();

            if ($alreadyProcessed) {
                return response()->json([
                    'message' => 'Cette transaction a déjà été traitée.',
                ], 409);
            }

            $confirmedOrder = DB::transaction(function () use ($order, $intent) {
                $lockedOrder = Order::whereKey($order->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($lockedOrder->payment_status === 'paid') {
                    return null;
                }

                Payment::create([
                    'order_id' => $lockedOrder->id,
                    'amount' => $lockedOrder->total_amount,
                    'method' => 'card',
                    'transaction_id' => $intent->id,
                    'status' => 'completed',
                ]);

                $lockedOrder->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                ]);

                return $lockedOrder->load('items.product', 'user');
            });

            if (!$confirmedOrder) {
                return response()->json([
                    'message' => 'Cette commande est déjà payée.',
                ], 409);
            }

            try {
                Mail::to($confirmedOrder->user->email)
                    ->send(new OrderConfirmed($confirmedOrder));
            } catch (\Throwable $mailError) {
                report($mailError);
            }

            return response()->json([
                'message' => 'Paiement vérifié et confirmé.',
                'order' => $confirmedOrder,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Impossible de vérifier le paiement pour le moment.',
            ], 502);
        }
    }

    public function mobileMoney(Request $request)
    {
        return response()->json([
            'message' => 'Le paiement Mobile Money n’est pas encore disponible. Aucun paiement n’a été effectué.',
        ], 503);
    }
}
