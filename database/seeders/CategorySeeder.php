<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'  => 'Lunettes',
                'image' => 'https://images.unsplash.com/photo-1577744486770-020ab432da65?w=600&q=80',
                'children' => [
                    ['name' => 'Lunettes de soleil', 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'],
                    ['name' => 'Lunettes optiques',  'image' => 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80'],
                    ['name' => 'Lunettes de sport',  'image' => 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80'],
                    ['name' => 'Lunettes enfants',   'image' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80'],
                ]
            ],
            [
                'name'  => 'Habits',
                'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
                'children' => [
                    ['name' => 'Robes',    'image' => 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80'],
                    ['name' => 'T-shirts', 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
                    ['name' => 'Pantalons','image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
                    ['name' => 'Vestes',   'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
                    ['name' => 'Chemises', 'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'],
                    ['name' => 'Pulls',    'image' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'],
                ]
            ],
            [
                'name'  => 'Chaussures',
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                'children' => [
                    ['name' => 'Sneakers',  'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'],
                    ['name' => 'Escarpins', 'image' => 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'],
                    ['name' => 'Sandales',  'image' => 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80'],
                    ['name' => 'Bottes',    'image' => 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80'],
                    ['name' => 'Mocassins', 'image' => 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80'],
                ]
            ],
            [
                'name'  => 'Parfums',
                'image' => 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
                'children' => [
                    ['name' => 'Parfums homme',    'image' => 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80'],
                    ['name' => 'Parfums femme',    'image' => 'https://images.unsplash.com/photo-1588514912908-1c62e32c7a4e?w=600&q=80'],
                    ['name' => 'Parfums mixtes',   'image' => 'https://images.unsplash.com/photo-1547887538-047dcef09362?w=600&q=80'],
                    ['name' => 'Coffrets cadeaux', 'image' => 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80'],
                ]
            ],
            [
                'name'  => 'Sacs',
                'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
                'children' => [
                    ['name' => 'Sacs à main',      'image' => 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80'],
                    ['name' => 'Sacs à dos',       'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
                    ['name' => 'Sacs de voyage',   'image' => 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80'],
                    ['name' => 'Pochettes',        'image' => 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80'],
                    ['name' => 'Sacs bandoulière', 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'],
                ]
            ],
        ];

        foreach ($categories as $cat) {
            $parent = Category::create([
                'name'      => $cat['name'],
                'slug'      => Str::slug($cat['name']),
                'image'     => $cat['image'],
                'status'    => 'active',
                'parent_id' => null,
            ]);

            foreach ($cat['children'] as $child) {
                Category::create([
                    'name'      => $child['name'],
                    'slug'      => Str::slug($child['name']),
                    'image'     => $child['image'],
                    'status'    => 'active',
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}