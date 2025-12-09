import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNotification } from "../context/NotificationContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const { showNotification } = useNotification(); 

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/cart/${user.id}`)
                .then(res => res.json())
                .then(data => setCart(data))
                .catch(err => console.error("Ошибка загрузки корзины:", err));
        } else {
            setCart([]);
        }
    }, [user]);

    useEffect(() => {
    if (user) {
      if (cart.length > 0) {
          fetch(`http://localhost:5000/cart/${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
          }).catch(console.error);
      }
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, user]);

    const saveToServer = (newCartItems) => {
        if (!user) return;

        fetch(`http://localhost:5000/cart/${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: newCartItems }),
        }).catch(err => console.error("Ошибка сохранения корзины:", err));
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            let newCart;

            if (existing) {
                newCart = prev.map((item) => 
                    item.id === product.id
                    ? {...item, quantity: item.quantity + (product.quantity || 1) } : item
                );
            } else {
                newCart = [...prev, { ...product, quantity: product.quantity || 1}];
            }
            
            saveToServer(newCart);
            showNotification(`Товар "${product.title}" добавлен в корзину!`, "success");
            return newCart;
        });
    };

    const updateQuantity = (id, qty) => {
        setCart((prev) => {
            const newCart = prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
            );
            saveToServer(newCart);
            return newCart;
        });
    }

    const removeFromCart = (id) => {
        setCart((prev) => {
            const newCart = prev.filter((item) => item.id !== id);
            saveToServer(newCart);
            showNotification("Товар успешно удалён!", "success");
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        saveToServer([]);
        showNotification("Корзина успешно очищена!", "success");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity}}>
            {children}
        </CartContext.Provider>
    )
};