import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Button,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/orders/${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.reverse()))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Войдите, чтобы видеть историю заказов</Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Войти
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ShoppingBagIcon fontSize="large" color="primary" />
        Мои заказы
      </Typography>

      {orders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 5, textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас пока нет заказов
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Самое время выбрать что-то интересное в каталоге!
          </Typography>
          <Button 
            component={Link} 
            to="/catalog" 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 3 }}
          >
            Перейти к покупкам
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Accordion key={order.id} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8f9fa' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">Номер заказа</Typography>
                    <Typography fontWeight="bold">#{order.id}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">Дата</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Typography fontWeight="500">
                            {new Date(order.date).toLocaleDateString()}
                        </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">Сумма</Typography>
                    <Typography fontWeight="bold" color="primary">€{Number(order.total).toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Chip 
                        label={order.status === "processing" ? "В обработке" : "Выполнен"} 
                        color={order.status === "processing" ? "warning" : "success"} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}>Состав заказа:</Typography>
                
                <Stack spacing={2}>
                    {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img 
                                    src={item.img || item.image || "https://placehold.co/50"} 
                                    alt={item.name} 
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} 
                                />
                                <Box>
                                    <Typography variant="body1" fontWeight="500">{item.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.quantity} шт. x {item.price}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography fontWeight="bold">
                                {((Number(String(item.price).replace(/[^0-9.]/g, '')) || 0) * item.quantity).toFixed(2)}€
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">Адрес доставки:</Typography>
                    <Typography variant="body2">{order.shippingInfo?.country}, {order.shippingInfo?.address}</Typography>
                    <Typography variant="body2">{order.shippingInfo?.name}, {order.shippingInfo?.phone}</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </Box>
  );
}