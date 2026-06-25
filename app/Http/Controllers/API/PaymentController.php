<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Mail\OrderConfirmed;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Commande déjà payée'], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount'   => $order->total_amount * 100,
            'currency' => 'xof',
            'metadata' => ['order_id' => $order->id],
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'order'         => $order,
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'order_id'       => 'required|exists:orders,id',
            'transaction_id' => 'required|string',
            'method'         => 'required|in:card,mobile_money,paypal',
        ]);


        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($request->order_id);


        Mail::to($order->user->email)->send(new OrderConfirmed($order->load('items.product', 'user')));
        Payment::create([
            'order_id'       => $order->id,
            'amount'         => $order->total_amount,
            'method'         => $request->method,
            'transaction_id' => $request->transaction_id,
            'status'         => 'completed',
        ]);

        $order->update(['payment_status' => 'paid', 'status' => 'processing']);

        return response()->json(['message' => 'Paiement confirmé', 'order' => $order]);
    }

    public function mobileMoney(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'phone'    => 'required|string',
            'operator' => 'required|in:mtn,moov',
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Commande déjà payée'], 400);
        }

        $transaction_id = 'MM-' . strtoupper(uniqid());

        Payment::create([
            'order_id'       => $order->id,
            'amount'         => $order->total_amount,
            'method'         => 'mobile_money',
            'transaction_id' => $transaction_id,
            'status'         => 'pending',
        ]);

        return response()->json([
            'message'        => 'Demande de paiement Mobile Money envoyée',
            'transaction_id' => $transaction_id,
            'instructions'   => "Composez *880# sur votre téléphone {$request->phone} pour confirmer le paiement de {$order->total_amount} FCFA",
        ]);
    }
}