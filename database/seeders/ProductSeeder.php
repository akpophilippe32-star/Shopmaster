<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Lunettes de soleil aviateur doré premium', 'category' => 'Lunettes de soleil', 'price' => 25000, 'promo' => 18000, 'qty' => 50,
             'images' => ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80']],

            ['name' => 'Lunettes de soleil oversized noires élégantes', 'category' => 'Lunettes de soleil', 'price' => 22000, 'promo' => null, 'qty' => 30,
             'images' => ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80']],

            ['name' => 'Lunettes de soleil cat-eye léopard tendance', 'category' => 'Lunettes de soleil', 'price' => 28000, 'promo' => 20000, 'qty' => 25,
             'images' => ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80']],

            ['name' => 'Lunettes de soleil sport miroir bleu', 'category' => 'Lunettes de soleil', 'price' => 35000, 'promo' => null, 'qty' => 40,
             'images' => ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80']],

            ['name' => 'Monture optique ronde acetate noire', 'category' => 'Lunettes optiques', 'price' => 45000, 'promo' => 38000, 'qty' => 20,
             'images' => ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80']],

            ['name' => 'Monture optique rectangulaire dorée', 'category' => 'Lunettes optiques', 'price' => 52000, 'promo' => null, 'qty' => 15,
             'images' => ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80']],

            ['name' => 'Robe longue fleurie bohème été légère', 'category' => 'Robes', 'price' => 18000, 'promo' => 14000, 'qty' => 60,
             'images' => ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80']],

            ['name' => 'Robe midi élégante noire soirée chic', 'category' => 'Robes', 'price' => 35000, 'promo' => null, 'qty' => 45,
             'images' => ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80']],

            ['name' => 'Robe courte casual rayures bleues marine', 'category' => 'Robes', 'price' => 12000, 'promo' => 9000, 'qty' => 80,
             'images' => ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80']],

            ['name' => 'Robe de soirée paillettes argentées luxe', 'category' => 'Robes', 'price' => 65000, 'promo' => 50000, 'qty' => 20,
             'images' => ['https://images.unsplash.com/photo-1566479179817-c0d3e71af993?w=600&q=80']],

            ['name' => 'T-shirt oversize coton blanc premium qualité', 'category' => 'T-shirts', 'price' => 8000, 'promo' => null, 'qty' => 100,
             'images' => ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80']],

            ['name' => 'T-shirt graphique streetwear noir imprimé', 'category' => 'T-shirts', 'price' => 12000, 'promo' => 9000, 'qty' => 75,
             'images' => ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80']],

            ['name' => 'T-shirt basique col V homme gris chiné', 'category' => 'T-shirts', 'price' => 7500, 'promo' => null, 'qty' => 90,
             'images' => ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80']],

            ['name' => 'Pantalon cargo kaki multi-poches tendance', 'category' => 'Pantalons', 'price' => 22000, 'promo' => 18000, 'qty' => 55,
             'images' => ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80']],

            ['name' => 'Jean slim fit bleu délavé homme moderne', 'category' => 'Pantalons', 'price' => 28000, 'promo' => null, 'qty' => 65,
             'images' => ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80']],

            ['name' => 'Pantalon large palazzo beige femme élégant', 'category' => 'Pantalons', 'price' => 20000, 'promo' => 15000, 'qty' => 40,
             'images' => ['https://images.unsplash.com/photo-1594938298603-c8148c4b5d8b?w=600&q=80']],

            ['name' => 'Sneakers blanches cuir premium homme luxe', 'category' => 'Sneakers', 'price' => 45000, 'promo' => 38000, 'qty' => 35,
             'images' => ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80']],

            ['name' => 'Sneakers colorées chunky femme tendance', 'category' => 'Sneakers', 'price' => 42000, 'promo' => null, 'qty' => 28,
             'images' => ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80']],

            ['name' => 'Sneakers running sport légères respirantes', 'category' => 'Sneakers', 'price' => 38000, 'promo' => 30000, 'qty' => 50,
             'images' => ['https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80']],

            ['name' => 'Escarpins nude talon aiguille 10cm femme', 'category' => 'Escarpins', 'price' => 32000, 'promo' => 25000, 'qty' => 30,
             'images' => ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80']],

            ['name' => 'Escarpins noirs vernis classiques élégants', 'category' => 'Escarpins', 'price' => 35000, 'promo' => null, 'qty' => 25,
             'images' => ['https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80']],

            ['name' => 'Sandales plates tressées camel été plage', 'category' => 'Sandales', 'price' => 15000, 'promo' => 12000, 'qty' => 45,
             'images' => ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80']],

            ['name' => 'Sandales compensées dorées femme chic', 'category' => 'Sandales', 'price' => 22000, 'promo' => null, 'qty' => 35,
             'images' => ['https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&q=80']],

            ['name' => 'Parfum homme boisé intense 100ml premium', 'category' => 'Parfums homme', 'price' => 55000, 'promo' => 45000, 'qty' => 40,
             'images' => ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80']],

            ['name' => 'Eau de toilette fraîche aquatique 75ml homme', 'category' => 'Parfums homme', 'price' => 38000, 'promo' => null, 'qty' => 30,
             'images' => ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80']],

            ['name' => 'Parfum oud oriental luxe 50ml exclusif', 'category' => 'Parfums homme', 'price' => 85000, 'promo' => 70000, 'qty' => 20,
             'images' => ['https://images.unsplash.com/photo-1547887538-047dcef09362?w=600&q=80']],

            ['name' => 'Parfum femme floral rose élégant 100ml', 'category' => 'Parfums femme', 'price' => 62000, 'promo' => 50000, 'qty' => 35,
             'images' => ['https://images.unsplash.com/photo-1588514912908-1c62e32c7a4e?w=600&q=80']],

            ['name' => 'Eau de parfum vanille sucrée envoûtante 75ml', 'category' => 'Parfums femme', 'price' => 45000, 'promo' => null, 'qty' => 28,
             'images' => ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80']],

            ['name' => 'Parfum fruité pêche mangue tropical 50ml', 'category' => 'Parfums femme', 'price' => 35000, 'promo' => 28000, 'qty' => 40,
             'images' => ['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80']],

            ['name' => 'Sac à main cuir véritable camel premium femme', 'category' => 'Sacs à main', 'price' => 75000, 'promo' => 60000, 'qty' => 25,
             'images' => ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80']],

            ['name' => 'Mini sac bandoulière chaîne dorée noir luxe', 'category' => 'Sacs à main', 'price' => 45000, 'promo' => null, 'qty' => 30,
             'images' => ['https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80']],

            ['name' => 'Sac tote shopper toile beige logo élégant', 'category' => 'Sacs à main', 'price' => 28000, 'promo' => 22000, 'qty' => 50,
             'images' => ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80']],

            ['name' => 'Sac à dos cuir noir élégant 20L premium', 'category' => 'Sacs à dos', 'price' => 55000, 'promo' => 45000, 'qty' => 35,
             'images' => ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80']],

            ['name' => 'Sac à dos voyage imperméable gris moderne', 'category' => 'Sacs à dos', 'price' => 42000, 'promo' => null, 'qty' => 40,
             'images' => ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80']],

            ['name' => 'Pochette soirée satin brodée dorée élégante', 'category' => 'Pochettes', 'price' => 18000, 'promo' => 14000, 'qty' => 45,
             'images' => ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80']],

            ['name' => 'Pochette enveloppe cuir nude soirée chic', 'category' => 'Pochettes', 'price' => 22000, 'promo' => null, 'qty' => 30,
             'images' => ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80']],
        ];

        foreach ($products as $p) {
            $category = Category::where('name', $p['category'])->first();
            if (!$category) continue;

            $product = Product::create([
                'category_id'     => $category->id,
                'name'            => $p['name'],
                'slug'            => Str::slug($p['name']) . '-' . Str::random(4),
                'description'     => 'Produit de qualité premium. ' . $p['name'] . '. Disponible en plusieurs couleurs et tailles.',
                'price'           => $p['price'],
                'promotion_price' => $p['promo'],
                'quantity'        => $p['qty'],
                'status'          => 'active',
            ]);

            foreach ($p['images'] as $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url'  => $imageUrl,
                ]);
            }
        }
    }
}