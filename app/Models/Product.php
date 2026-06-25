<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'promotion_price', 'quantity', 'status'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }
    public function images() {
        return $this->hasMany(ProductImage::class);
    }
    public function reviews() {
        return $this->hasMany(Review::class);
    }
    public function cartItems() {
        return $this->hasMany(Cart::class);
    }
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
    public function getEffectivePriceAttribute() {
        return $this->promotion_price ?? $this->price;
    }
}