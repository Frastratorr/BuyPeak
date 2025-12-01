import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNotification } from "../context/NotificationContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useContext(AuthContext); // Достаем текущего юзера
    const [cart, setCart] = useState([]);
    const { showNotification } = useNotification(); 

    // 1. Загрузка корзины при смене пользователя (Вход / Выход)
    useEffect(() => {
        if (user) {
            // Если пользователь залогинен — грузим с сервера
            fetch(`http://localhost:5000/cart/${user.id}`)
                .then(res => res.json())
                .then(data => setCart(data))
                .catch(err => console.error("Ошибка загрузки корзины:", err));
        } else {
            // Если пользователь вышел — очищаем корзину
            setCart([]);
        }
    }, [user]);

    // Вспомогательная функция для сохранения на сервере
    const saveToServer = (newCartItems) => {
        if (!user) return; // Если не залогинен, на сервер не шлем (или можно сохранять в LocalStorage для гостя)

        fetch(`http://localhost:5000/cart/${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: newCartItems }),
        }).catch(err => console.error("Ошибка сохранения корзины:", err));
    };

    // 2. Добавление товара
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
            
            // Сразу сохраняем новую версию на сервер
            saveToServer(newCart);
            showNotification(`Товар "${product.title}" добавлен в корзину!`, "success");
            return newCart;
        });
    };

    // 3. Обновление количества
    const updateQuantity = (id, qty) => {
        setCart((prev) => {
            const newCart = prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
            );
            saveToServer(newCart);
            return newCart;
        });
    }

    // 4. Удаление товара
    const removeFromCart = (id) => {
        setCart((prev) => {
            const newCart = prev.filter((item) => item.id !== id);
            saveToServer(newCart);
            showNotification("Товар успешно удалён!", "success");
            return newCart;
        });
    };

    // 5. Полная очистка (например после покупки)
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