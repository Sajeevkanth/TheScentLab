import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Recommend from './pages/Recommend';
import Cart from './pages/Cart';
import { AuthProvider } from './services/AuthContext';
import { CartProvider } from './services/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="app">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/recommend" element={<Recommend />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
