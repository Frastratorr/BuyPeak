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
import { AuthContext } from "../context/AuthContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
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
    <Box sx={{ maxWidth: "xl", margin: "0 auto", p: { xs: 2, md: 6 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 5, textAlign: "center" }}>
        Корзина ({cart.reduce((acc, item) => acc + item.quantity, 0)})
      </Typography>

      <Grid container spacing={4} justifyContent="space-between">
        
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {cart.map((item, index) => {
              const priceStr = item.price ? String(item.price).replace(/[^0-9.]/g, '') : "0";
              const priceNum = Number(priceStr) || 0;
              const uniqueKey = item.id || item._id || index;
              const itemId = item.id || item._id; 

              return (
                <Box key={uniqueKey}>
                  <Card 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center",
                      p: 2, 
                      borderRadius: 4, 
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      width: "100%",
                      transition: "0.3s",
                      "&:hover": { boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        borderRadius: 3, 
                        objectFit: "contain",
                        bgcolor: "#f9f9f9" 
                      }}
                      image={item.img || item.image || "https://placehold.co/120"}
                      alt={item.name}
                    />

                    <Box sx={{ 
                        display: "flex", 
                        flex: 1, 
                        ml: 3, 
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2
                    }}>
                      
                      <Box sx={{ minWidth: "150px" }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem", lineHeight: 1.2, mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Артикул: {itemId || "—"}
                        </Typography>
                      </Box>

                      <Box 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          bgcolor: "#f0f4f8", 
                          borderRadius: "50px",
                          padding: "4px 6px"
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))} 
                          disabled={item.quantity <= 1}
                          sx={{ bgcolor: "white", boxShadow: 1, width: 32, height: 32 }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        
                        <Typography sx={{ mx: 2, fontWeight: "bold", fontSize: "16px", minWidth: "20px", textAlign: "center" }}>
                          {item.quantity}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          sx={{ bgcolor: "white", boxShadow: 1, width: 32, height: 32 }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" fontWeight="bold" color="primary" sx={{ minWidth: "80px", textAlign: "right" }}>
                        ${(priceNum * item.quantity).toFixed(2)}
                      </Typography>

                      <IconButton onClick={() => removeFromCart(itemId)} color="error" sx={{ opacity: 0.7, '&:hover': { opacity: 1, bgcolor: "#ffebee" } }}>
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Stack>

          <Button 
            variant="text" 
            color="error" 
            startIcon={<DeleteOutline />} 
            onClick={clearCart} 
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            Очистить корзину
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              borderRadius: 4, 
              border: "1px solid #eee",
              position: "sticky", 
              top: 100,
              bgcolor: "#fafafa" 
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Ваш заказ</Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                  Товары ({cart.length})
                </Typography>
                <Typography fontWeight="600" sx={{ fontSize: "1.1rem" }}>
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
                  <Typography fontWeight="600" sx={{ fontSize: "1.1rem" }}>
                    ${deliveryCost.toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="#333">Итого</Typography>
              <Typography variant="h3" fontWeight="bold" color="primary" sx={{ fontSize: "2rem" }}>
                ${finalPrice.toFixed(2)}
              </Typography>
            </Box>

            <Button 
              component={Link}
              to="/checkout"
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ 
                borderRadius: "16px", 
                height: "60px", 
                fontSize: "18px", 
                fontWeight: "bold",
                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)"
              }}
            >
              Перейти к оформлению
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}