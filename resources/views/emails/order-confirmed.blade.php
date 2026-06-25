<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563EB; padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: #BFDBFE; margin: 8px 0 0; }
        .body { padding: 30px; }
        .success { background: #DCFCE7; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; }
        .success p { color: #166534; font-weight: bold; margin: 0; }
        .order-info { background: #F8FAFC; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
        .order-info table { width: 100%; border-collapse: collapse; }
        .order-info td { padding: 8px 0; font-size: 14px; }
        .order-info td:first-child { color: #6B7280; }
        .order-info td:last-child { font-weight: bold; text-align: right; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .items-table th { background: #F1F5F9; padding: 12px; text-align: left; font-size: 13px; color: #6B7280; }
        .items-table td { padding: 12px; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
        .total-row td { font-weight: bold; font-size: 16px; color: #2563EB; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; }
        .footer p { color: #9CA3AF; font-size: 13px; margin: 4px 0; }
        .btn { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ ShopMaster</h1>
            <p>Votre boutique en ligne</p>
        </div>
        <div class="body">
            <div class="success">
                <p>✅ Commande confirmée avec succès !</p>
            </div>

            <p>Bonjour <strong>{{ $order->user->name }}</strong>,</p>
            <p>Nous avons bien reçu votre commande. Voici le récapitulatif :</p>

            <div class="order-info">
                <table>
                    <tr>
                        <td>N° Commande</td>
                        <td>{{ $order->order_number }}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                    </tr>
                    <tr>
                        <td>Adresse</td>
                        <td>{{ $order->address }}</td>
                    </tr>
                    <tr>
                        <td>Téléphone</td>
                        <td>{{ $order->phone }}</td>
                    </tr>
                </table>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Qté</th>
                        <th>Prix</th>
                        <th>Sous-total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ $item->price }} FCFA</td>
                        <td>{{ $item->subtotal }} FCFA</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="3">Total</td>
                        <td>{{ $order->total_amount }} FCFA</td>
                    </tr>
                </tbody>
            </table>

            <div style="text-align: center;">
                <a href="http://localhost:8000/orders" class="btn">
                    Voir mes commandes
                </a>
            </div>
        </div>
        <div class="footer">
            <p>Merci pour votre confiance !</p>
            <p>© 2026 ShopMaster — Tous droits réservés</p>
        </div>
    </div>
</body>
</html>