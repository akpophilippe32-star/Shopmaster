<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();
        return response()->json($cart);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
        } else {
            $cart = Cart::create([
                'user_id'    => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
            ]);
        }

        return response()->json($cart->load('product'), 201);
    }

    public function update(Request $request, $id)
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate(['quantity' => 'required|integer|min:1']);
        $cart->update(['quantity' => $request->quantity]);

        return response()->json($cart);
    }

    public function destroy(Request $request, $id)
    {
        Cart::where('user_id', $request->user()->id)
            ->findOrFail($id)
            ->delete();

        return response()->json(['message' => 'Article supprimé']);
    }

    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Panier vidé']);
    }
}