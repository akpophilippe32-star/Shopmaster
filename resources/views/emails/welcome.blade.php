<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563EB; padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: #BFDBFE; margin: 8px 0 0; font-size: 16px; }
        .body { padding: 40px 30px; }
        .features { display: flex; gap: 16px; margin: 24px 0; }
        .feature { flex: 1; background: #F8FAFC; border-radius: 8px; padding: 16px; text-align: center; }
        .feature p { margin: 8px 0 0; font-size: 13px; color: #6B7280; }
        .btn { display: inline-block; background: #2563EB; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; }
        .footer p { color: #9CA3AF; font-size: 13px; margin: 4px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ ShopMaster</h1>
            <p>Bienvenue dans votre boutique en ligne !</p>
        </div>
        <div class="body">
            <h2>Bonjour {{ $user->name }} ! 👋</h2>
            <p>Nous sommes ravis de vous accueillir sur <strong>ShopMaster</strong>. Votre compte a été créé avec succès.</p>

            <p><strong>Vos informations :</strong></p>
            <ul>
                <li>Email : {{ $user->email }}</li>
                <li>Compte créé le : {{ now()->format('d/m/Y') }}</li>
            </ul>

            <p>Vous pouvez maintenant :</p>
            <ul>
                <li>🛒 Parcourir nos produits</li>
                <li>❤️ Ajouter des articles à votre panier</li>
                <li>📦 Passer des commandes</li>
                <li>💳 Payer en ligne en toute sécurité</li>
            </ul>

            <div style="text-align: center;">
                <a href="http://localhost:8000/products" class="btn">
                    Découvrir nos produits
                </a>
            </div>
        </div>
        <div class="footer">
            <p>Merci pour votre inscription !</p>
            <p>© 2026 ShopMaster — Tous droits réservés</p>
        </div>
    </div>
</body>
</html>