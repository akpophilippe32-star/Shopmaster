<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string',
            'phone'   => 'required|string',
        ]);

        $cartItems = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Panier vide'], 400);
        }

        $total = $cartItems->sum(function ($item) {
            $price = $item->product->promotion_price ?? $item->product->price;
            return $price * $item->quantity;
        });

        $order = Order::create([
            'user_id'        => $request->user()->id,
            'order_number'   => 'ORD-' . strtoupper(Str::random(8)),
            'total_amount'   => $total,
            'status'         => 'pending',
            'payment_status' => 'unpaid',
            'address'        => $request->address,
            'phone'          => $request->phone,
        ]);

        foreach ($cartItems as $item) {
            $price = $item->product->promotion_price ?? $item->product->price;
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'price'      => $price,
                'subtotal'   => $price * $item->quantity,
            ]);

            $item->product->decrement('quantity', $item->quantity);
        }

        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json($order->load('items.product'), 201);
    }

    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with('items.product', 'payment')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }
}