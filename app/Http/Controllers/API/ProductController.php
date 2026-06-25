<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->where('status', 'active');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->paginate($request->per_page ?? 12);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id'     => 'required|exists:categories,id',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'promotion_price' => 'nullable|numeric|min:0',
            'quantity'        => 'required|integer|min:0',
            'status'          => 'in:active,inactive',
            'images.*'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product = Product::create([
            'category_id'     => $request->category_id,
            'name'            => $request->name,
            'slug'            => Str::slug($request->name),
            'description'     => $request->description,
            'price'           => $request->price,
            'promotion_price' => $request->promotion_price,
            'quantity'        => $request->quantity,
            'status'          => $request->status ?? 'active',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['image_url' => $path]);
            }
        }

        return response()->json($product->load('category', 'images'), 201);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'reviews.user'])
            ->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id'     => 'sometimes|exists:categories,id',
            'name'            => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'sometimes|numeric|min:0',
            'promotion_price' => 'nullable|numeric|min:0',
            'quantity'        => 'sometimes|integer|min:0',
            'status'          => 'in:active,inactive',
            'images.*'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product->update([
            'category_id'     => $request->category_id ?? $product->category_id,
            'name'            => $request->name ?? $product->name,
            'slug'            => $request->name ? Str::slug($request->name) : $product->slug,
            'description'     => $request->description ?? $product->description,
            'price'           => $request->price ?? $product->price,
            'promotion_price' => $request->promotion_price ?? $product->promotion_price,
            'quantity'        => $request->quantity ?? $product->quantity,
            'status'          => $request->status ?? $product->status,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['image_url' => $path]);
            }
        }

        return response()->json($product->load('category', 'images'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        foreach ($product->images as $image) {
            \Storage::disk('public')->delete($image->image_url);
        }

        $product->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}