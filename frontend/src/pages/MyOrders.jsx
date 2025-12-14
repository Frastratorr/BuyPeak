import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
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
  Stack,
  Divider,
  Avatar
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const getStatusConfig = (status) => {
  switch (status) {
    case "shipped":
      return { label: "Отправлен", color: "info" };
    case "delivered":
      return { label: "Доставлен", color: "success" };
    case "canceled":
      return { label: "Отменен", color: "error" };
    default:
      return { label: "В обработке", color: "warning" };
  }
};

export default function MyOrders() {
  // 🔥 ЖЕСТКАЯ ССЫЛКА НА СЕРВЕР
  const API_URL = "https://buypeak.onrender.com";

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/orders/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
            const sorted = data.reverse();
            setOrders(sorted);

            // Логика для открытия конкретного заказа (если перешли из меню)
            if (location.state?.targetOrderId) {
                const targetId = location.state.targetOrderId;
                setExpanded(targetId);
                setTimeout(() => {
                    const element = document.getElementById(`order-${targetId}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, location.state]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
    <Box className="fade-in" sx={{ maxWidth: "1000px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ShoppingBagIcon fontSize="large" color="primary" />
        Мои заказы
      </Typography>

      {orders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 5, textAlign: "center", borderRadius: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
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
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            
            return (
              <Accordion 
                  key={order.id} 
                  id={`order-${order.id}`}
                  expanded={expanded === order.id}
                  onChange={handleChange(order.id)}
                  sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: "0 2px 8px rgba(0,0,0,0.05)", '&:before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: expanded === order.id ? '#e3f2fd' : '#fff', transition: 'background-color 0.3s' }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary">Номер заказа</Typography>
                      <Typography fontWeight="bold">#{order.id.toString().slice(-6)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Дата</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EventIcon fontSize="small" color="action" />
                          <Typography fontWeight="500" fontSize="0.9rem">
                              {new Date(order.date).toLocaleDateString()}
                          </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Сумма</Typography>
                      <Typography fontWeight="bold" color="primary">${Number(order.total).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Chip 
                          label={statusConfig.label} 
                          color={statusConfig.color} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                      />
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <Divider />
                  <Box sx={{ p: 3, bgcolor: "#fafafa" }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Состав заказа:</Typography>
                      
                      <Stack spacing={2}>
                          {order.items.map((item, index) => (
                              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', p: 1.5, borderRadius: 2, border: '1px solid #eee' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Avatar 
                                          src={item.img || item.image || "https://placehold.co/50"} 
                                          variant="rounded"
                                          sx={{ width: 50, height: 50 }} 
                                      />
                                      <Box>
                                          <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                                          <Typography variant="caption" color="text.secondary">
                                              {item.quantity} шт. x ${item.price}
                                          </Typography>
                                      </Box>
                                  </Box>
                                  <Typography fontWeight="bold" color="#333">
                                      ${((Number(String(item.price).replace(/[^0-9.]/g, '')) || 0) * item.quantity).toFixed(2)}
                                  </Typography>
                              </Box>
                          ))}
                      </Stack>

                      <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, border: '1px dashed #ccc' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <LocalShippingIcon color="action" fontSize="small" />
                              <Typography variant="subtitle2" fontWeight="bold">Доставка:</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                              {order.shippingInfo?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                              {order.shippingInfo?.country}, {order.shippingInfo?.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                              {order.shippingInfo?.phone}
                          </Typography>
                      </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}