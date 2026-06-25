# ShopMaster

Plateforme e-commerce complète développée avec **Laravel 12** (API REST) et **React 19** (SPA).
ShopMaster permet aux clients de parcourir des produits, gérer un panier, passer des commandes et payer en ligne (Stripe / Mobile Money), tandis que les administrateurs disposent d'un tableau de bord complet pour gérer produits, catégories, commandes et clients.

## Aperçu

- Frontend premium inspiré des sites e-commerce haut de gamme (mega menu, hero vidéo, fiches produits détaillées)
- Backend API REST sécurisé avec authentification par token
- Paiements en ligne (carte bancaire via Stripe, Mobile Money)
- Emails transactionnels automatiques
- Tableau de bord administrateur avec statistiques et graphiques

## Fonctionnalités

### Côté client

- Inscription / connexion (Laravel Sanctum)
- Catalogue de produits avec filtres, tri et recherche
- Mega menu de catégories et sous-catégories
- Fiche produit détaillée (galerie d'images, avis, produits similaires)
- Panier persistant
- Tunnel de commande (checkout)
- Paiement par carte bancaire (Stripe) ou Mobile Money
- Historique des commandes
- Gestion du profil et du mot de passe
- Avis et notation des produits

### Côté administration

- Tableau de bord avec statistiques (revenus, commandes, clients, produits)
- Graphiques (revenus mensuels, commandes, statuts)
- Gestion des produits (CRUD, images)
- Gestion des catégories et sous-catégories
- Gestion des commandes et de leur statut
- Gestion des clients

### Emails automatiques

- Email de bienvenue à l'inscription
- Email de confirmation de commande après paiement

## Stack technique

**Backend**

- Laravel 12 / PHP 8.2
- MySQL
- Laravel Sanctum (authentification API)
- Stripe PHP SDK
- Mailtrap (emails en développement)

**Frontend**

- React 19
- React Router
- Axios
- Zustand (gestion d'état : panier, authentification)
- Tailwind CSS 4
- Lucide React (icônes)
- Recharts (graphiques)

**Outils**

- Vite 8
- Node.js
- Composer / npm

## Prérequis

- PHP >= 8.2
- Composer >= 2
- Node.js >= 18
- MySQL >= 8
- Un serveur local type XAMPP / Laragon (ou équivalent)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/philippe/shopmaster.git
cd shopmaster
```

### 2. Installer les dépendances backend

```bash
composer install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

Renseignez ensuite dans `.env` :

- Vos identifiants de base de données (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
- Vos identifiants SMTP (Mailtrap ou autre) pour les emails
- Vos clés Stripe (`STRIPE_KEY`, `STRIPE_SECRET`)

### 4. Créer la base de données et lancer les migrations

Créez une base de données MySQL nommée `ecommerce_db` (ou le nom défini dans `.env`), puis :

```bash
php artisan migrate --seed
```

Cette commande crée toutes les tables et insère les catégories et produits de démonstration.

### 5. Lier le stockage public (images)

```bash
php artisan storage:link
```

### 6. Créer un compte administrateur

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@shopmaster.com',
    'password' => bcrypt('password123'),
    'role' => 'admin',
    'status' => 'active',
]);
```

### 7. Installer les dépendances frontend

```bash
npm install
```

### 8. Lancer le projet

Dans un premier terminal :

```bash
php artisan serve
```

Dans un second terminal :

```bash
npm run dev
```

L'application est accessible sur **http://127.0.0.1:8000**

## Comptes de test

| Rôle  | Email                | Mot de passe |
| ----- | -------------------- | ------------ |
| Admin | admin@shopmaster.com | password123  |

## Structure du projet

```
shopmaster/
├── app/
│   ├── Http/Controllers/API/      # Contrôleurs API (Auth, Produits, Commandes, Paiements...)
│   ├── Mail/                       # Classes d'emails (bienvenue, confirmation commande)
│   └── Models/                     # Modèles Eloquent
├── database/
│   ├── migrations/                 # Schémas de base de données
│   └── seeders/                    # Données de démonstration (catégories, produits)
├── resources/
│   ├── js/
│   │   ├── Pages/                  # Pages React (Home, Products, Cart, Admin...)
│   │   ├── components/             # Composants partagés (Navbar, AdminLayout...)
│   │   ├── store/                  # State management Zustand (auth, panier)
│   │   └── services/               # Configuration Axios
│   └── views/
│       └── emails/                 # Templates d'emails Blade
└── routes/
    ├── api.php                     # Routes API REST
    └── web.php                     # Route catch-all React SPA
```

## Architecture

```
Utilisateur → React (SPA) → Axios → Laravel API REST → MySQL
```

L'authentification utilise des tokens Bearer via Laravel Sanctum. Le frontend React communique exclusivement avec le backend via l'API REST.

## Roadmap / Évolutions possibles

- Application mobile (React Native)
- Notifications en temps réel
- Wishlist / favoris
- Variantes de produits (taille, couleur)
- Recherche avancée avec suggestions
- Tests automatisés (PHPUnit, Jest)
- Déploiement en production

## Auteur

**Philippe**

## Licence

Ce projet est développé à des fins d'apprentissage et de démonstration.
