<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:500',
        ]);

        $existing = Review::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà noté ce produit'], 400);
        }

        $review = Review::create([
            'user_id'    => $request->user()->id,
            'product_id' => $request->product_id,
            'rating'     => $request->rating,
            'comment'    => $request->comment,
        ]);

        return response()->json($review->load('user'), 201);
    }

    public function index($productId)
    {
        $reviews = Review::with('user')
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        $avgRating = $reviews->avg('rating');

        return response()->json([
            'reviews'    => $reviews,
            'avg_rating' => round($avgRating, 1),
            'total'      => $reviews->count(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $review->delete();

        return response()->json(['message' => 'Avis supprimé']);
    }
}