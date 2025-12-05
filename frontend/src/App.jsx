import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/catalog" element={<Catalog />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/product/:id" element={<Product />}/>
        <Route path="/cart" element={<CartPage />}/>
        <Route path="/checkout" element={<CheckoutPage />}/>
        <Route path="/myorders" element={<MyOrders />}/>
        <Route path="/admin" element={<AdminPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;