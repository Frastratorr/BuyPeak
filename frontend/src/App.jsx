import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog'
import Register from './pages/Register'
import CartPage from './pages/CartPage'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/catalog" element={<Catalog />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/product/:id" element={<Product />}/>
        <Route path="/cart" element={<CartPage />}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
