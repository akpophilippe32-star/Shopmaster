<?php
namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $clients = User::where('role', 'client')
            ->withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clients);
    }

    public function show($id)
    {
        $client = User::with('orders.items.product')
            ->findOrFail($id);

        return response()->json($client);
    }

    public function toggleStatus($id)
    {
        $client = User::findOrFail($id);
        $client->update([
            'status' => $client->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json($client);
    }

    public function destroy($id)
    {
        $client = User::findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Client supprimé']);
    }
}