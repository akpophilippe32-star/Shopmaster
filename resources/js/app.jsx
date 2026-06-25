import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Products from './Pages/Products';
import Cart from './Pages/Cart';
import AdminDashboard from './Pages/admin/Dashboard';
import AdminProducts from './Pages/admin/Products';
import AdminCategories from './Pages/admin/Categories';
import AdminOrders from './Pages/admin/Orders';
import '../css/app.css';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import Profile from './Pages/Profile';
import AdminClients from './Pages/admin/Clients';
import Payment from './Pages/Payment';
import ProductDetail from './Pages/ProductDetail';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/" />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />
                <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                <Route path="/products/:id" element={<ProductDetail />} />

            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(<App />);