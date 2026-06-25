<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', 'active')
            ->withCount('products')
            ->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'status'      => 'in:active,inactive',
        ]);

        $category = Category::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'image'       => $request->image,
            'status'      => $request->status ?? 'active',
        ]);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with('products')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'status'      => 'in:active,inactive',
        ]);

        $category->update([
            'name'        => $request->name ?? $category->name,
            'slug'        => $request->name ? Str::slug($request->name) : $category->slug,
            'description' => $request->description ?? $category->description,
            'image'       => $request->image ?? $category->image,
            'status'      => $request->status ?? $category->status,
        ]);

        return response()->json($category);
    }

    public function tree()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->where('status', 'active')
            ->get();

        return response()->json($categories);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Catégorie supprimée']);
    }
}