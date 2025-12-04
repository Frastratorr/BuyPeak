import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Grid,
  Paper, 
  Divider, 
  Stack,
  Card,
  CardMedia
} from "@mui/material";
import { 
  Add, 
  Remove, 
  DeleteOutline, 
  ShoppingCartCheckout, 
  ArrowBack 
} from "@mui/icons-material";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    if (!item.price) return sum;
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    const priceNum = Number(priceStr) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  const deliveryCost = total > 100 ? 0 : 10; 
  const finalPrice = total + deliveryCost;

  if (cart.length === 0) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "60vh",
          textAlign: "center",
          gap: 2,
          p: 2
        }}
      >
        <ShoppingCartCheckout sx={{ fontSize: 100, color: "#e0e0e0" }} />
        <Typography variant="h4" fontWeight="bold" color="text.secondary">
          Ваша корзина пуста
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
          Похоже, вы еще ничего не добавили. Перейдите в каталог, чтобы найти что-то интересное!
        </Typography>
        <Button 
          component={Link} 
          to="/catalog" 
          variant="contained" 
          size="large"
          startIcon={<ArrowBack />}
          sx={{ borderRadius: "20px", px: 4 }}
        >
          Вернуться к покупкам
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "xl", margin: "0 auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Корзина ({cart.reduce((acc, item) => acc + item.quantity, 0)})
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {cart.map((item) => {
              const priceStr = item.price ? String(item.price).replace(/[^0-9.]/g, '') : "0";
              const priceNum = Number(priceStr) || 0;
              
              return (
                <Card 
                  key={item.id} 
                  sx={{ 
                    display: "flex", 
                    p: 3, 
                    borderRadius: 3, 
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    width: "95%", 
                    alignItems: "center"
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
                    image={item.img || item.image || "https://placehold.co/120"}
                    alt={item.name}
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", flex: 1, ml: 3, justifyContent: "space-between", minHeight: 120 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.2rem" }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Код товара: {item.id}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => removeFromCart(item.id)} color="error">
                        <DeleteOutline />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                      <Box 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          bgcolor: "#f5f5f5", 
                          borderRadius: "12px",
                          padding: "4px 8px"
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        
                        <Typography sx={{ mx: 2, fontWeight: "bold", fontSize: "16px" }}>
                          {item.quantity}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" fontWeight="bold" color="primary" sx={{ fontSize: "1.3rem" }}>
                        ${(priceNum * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Stack>

          <Button 
            variant="text" 
            color="error" 
            startIcon={<DeleteOutline />} 
            onClick={clearCart} 
            sx={{ mt: 3 }}
          >
            Очистить корзину
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              borderRadius: 4, 
              position: "sticky", 
              top: 100 
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Детали заказа</Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                  Товары ({cart.length})
                </Typography>
                <Typography fontWeight="500" sx={{ fontSize: "1.1rem" }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                  Доставка
                </Typography>
                {deliveryCost === 0 ? (
                  <Typography color="success.main" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
                    Бесплатно
                  </Typography>
                ) : (
                  <Typography fontWeight="500" sx={{ fontSize: "1.1rem" }}>
                    ${deliveryCost.toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
              <Typography variant="h5" fontWeight="bold">Итого</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                ${finalPrice.toFixed(2)}
              </Typography>
            </Box>

            <Button 
              component={Link}
              to="/checkout"
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ borderRadius: "12px", height: "55px", fontSize: "18px", fontWeight: "bold" }}
            >
              Перейти к оформлению
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}