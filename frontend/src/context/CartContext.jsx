import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNotification } from "../context/NotificationContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
    // 🔥 ЖЕСТКО ПРОПИСЫВАЕМ ССЫЛКУ
    const API_URL = "https://buypeak.onrender.com";
    
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const { showNotification } = useNotification(); 

    useEffect(() => {
        if (user) {
            fetch(`${API_URL}/cart/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setCart(data);
                })
                .catch(err => console.error("Ошибка загрузки корзины:", err));
        } else {
            const localCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
            setCart(localCart);
        }
    }, [user]);

    const saveCartState = (newCartItems) => {
        if (user) {
            fetch(`${API_URL}/cart/${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: newCartItems }),
            }).catch(err => console.error("Ошибка сохранения корзины:", err));
        } else {
            localStorage.setItem("guest_cart", JSON.stringify(newCartItems));
        }
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            let newCart;
            if (existing) {
                newCart = prev.map((item) => item.id === product.id ? {...item, quantity: item.quantity + (product.quantity || 1) } : item);
            } else {
                newCart = [...prev, { ...product, quantity: product.quantity || 1}];
            }
            saveCartState(newCart);
            showNotification(`Товар "${product.name || product.title}" добавлен в корзину!`, "success");
            return newCart;
        });
    };

    const updateQuantity = (id, qty) => {
        setCart((prev) => {
            const newCart = prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item);
            saveCartState(newCart);
            return newCart;
        });
    }

    const removeFromCart = (id) => {
        setCart((prev) => {
            const newCart = prev.filter((item) => item.id !== id);
            saveCartState(newCart);
            showNotification("Товар удалён из корзины", "info");
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        saveCartState([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    )
};