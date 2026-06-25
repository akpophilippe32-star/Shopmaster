<?php
namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::where('payment_status', 'paid')
            ->sum('total_amount');

        $stats = [
            'products'      => Product::count(),
            'categories'    => Category::count(),
            'orders'        => Order::count(),
            'users'         => User::where('role', 'client')->count(),
            'total_revenue' => $totalRevenue,
            'pending_orders' => Order::where('status', 'pending')->count(),
            'recent_orders' => Order::with('user')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}