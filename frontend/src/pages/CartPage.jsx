// src/pages/CartPage.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = total > 0 ? 5 : 0;
  const final = total + delivery;

  if (cart.length === 0) {
    return <h2 style={{ padding: 20 }}>Корзина пуста</h2>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "40px auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Корзина</Typography>
      {cart.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        cart.map(item => (
          <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 1, borderRadius: 2, background: "#f5f5f5" }}>
            <img src={item.image} alt={item.name} width={60} height={60} style={{ borderRadius: 8, objectFit: "cover" }} />
            <Typography sx={{ flex: 1 }}>{item.name}</Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                <Remove />
              </IconButton>
              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
              <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Add />
              </IconButton>
            </Box>

            <Typography sx={{ width: 80, textAlign: "right" }}>{item.price * item.quantity}$</Typography>
            <IconButton onClick={() => removeFromCart(item.id)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))
      )}

      {cart.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Итого: {total}$</Typography>
          <Typography variant="h6">Доставка: {delivery}$</Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>К оплате: {final}$</Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Перейти к чекауту
          </Button>
          <Button variant="outlined" color="error" sx={{ mt: 2, ml: 2 }} onClick={clearCart}>
            Очистить корзину
          </Button>
        </Box>
      )}
    </Box>
  );
}