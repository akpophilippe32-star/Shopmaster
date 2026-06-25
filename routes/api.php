<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\ClientController;
use App\Http\Controllers\API\ReviewController;

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

// Routes publiques
Route::get('/categories/tree',  [CategoryController::class, 'tree']);
Route::get('/categories',       [CategoryController::class, 'index']);
Route::get('/categories/{id}',  [CategoryController::class, 'show']);
Route::get('/products',         [ProductController::class, 'index']);
Route::get('/products/{id}',    [ProductController::class, 'show']);
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {


    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/categories',        [CategoryController::class, 'store']);
    Route::put('/categories/{id}',    [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/products',        [ProductController::class, 'store']);
    Route::put('/products/{id}',    [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::get('/cart',         [CartController::class, 'index']);
    Route::post('/cart',        [CartController::class, 'store']);
    Route::put('/cart/{id}',    [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart',      [CartController::class, 'clear']);

    Route::get('/orders',      [OrderController::class, 'index']);
    Route::post('/orders',     [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    Route::post('/payments/intent',       [PaymentController::class, 'createIntent']);
    Route::post('/payments/confirm',      [PaymentController::class, 'confirm']);
    Route::post('/payments/mobile-money', [PaymentController::class, 'mobileMoney']);

    Route::post('/reviews',      [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    Route::prefix('admin')->group(function () {
        Route::get('/stats',              [DashboardController::class, 'stats']);
        Route::get('/orders',             [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}',        [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('/clients',            [ClientController::class, 'index']);
        Route::get('/clients/{id}',       [ClientController::class, 'show']);
        Route::put('/clients/{id}/toggle',[ClientController::class, 'toggleStatus']);
        Route::delete('/clients/{id}',    [ClientController::class, 'destroy']);
    });
});