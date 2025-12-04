import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { 
  Box, 
  Avatar, 
  Button, 
  Typography, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Divider, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import { 
    ShoppingCart, 
    Category as CategoryIcon, 
    Logout as LogoutIcon,
    ShoppingBag as OrdersIcon,
    KeyboardArrowDown,
    ReceiptLong,
    ArrowForward
} from "@mui/icons-material";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [ordersAnchorEl, setOrdersAnchorEl] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isOrdersOpen = Boolean(ordersAnchorEl);

  const handleOpenOrders = async (event) => {
    setOrdersAnchorEl(event.currentTarget);
    if (user) {
        try {
            const res = await fetch(`http://localhost:5000/orders/${user.id}`);
            if (!res.ok) {
                setRecentOrders([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setRecentOrders(data.reverse().slice(0, 5));
            }
        } catch (error) {
            console.error(error);
            setRecentOrders([]);
        }
    }
  };

  const handleCloseOrders = () => {
    setOrdersAnchorEl(null);
  };

  const handleOrderClick = (orderId) => {
    handleCloseOrders();
    navigate("/myorders", { state: { targetOrderId: orderId } });
  };

  const handleNavigateToOrders = () => {
    handleCloseOrders();
    navigate("/myorders");
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "10px 30px", 
        background: "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)", 
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography 
            variant="h5" 
            sx={{ fontWeight: "bold", letterSpacing: "1px", mr: 2 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>BuyPeak</Link>
        </Typography>
        
        <Button
          component={Link}
          to="/catalog"
          startIcon={<CategoryIcon />}
          sx={{ color: "white", textTransform: "none", fontSize: "16px" }}
        >
          Каталог
        </Button>

        {user && (
            <>
                <Button
                    onClick={handleOpenOrders}
                    startIcon={<OrdersIcon />}
                    endIcon={<KeyboardArrowDown />}
                    sx={{ color: "white", textTransform: "none", fontSize: "16px" }}
                >
                    Мои заказы
                </Button>
                <Menu
                    anchorEl={ordersAnchorEl}
                    open={isOrdersOpen}
                    onClose={handleCloseOrders}
                    PaperProps={{
                        elevation: 4,
                        sx: { width: 320, mt: 1.5, borderRadius: 2 }
                    }}
                >
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                            Последние заказы
                        </Typography>
                    </Box>
                    <Divider />
                    
                    {recentOrders.length === 0 ? (
                        <MenuItem disabled>
                            <ListItemText primary="История заказов пуста" />
                        </MenuItem>
                    ) : (
                        recentOrders.map((order) => (
                            <MenuItem key={order.id} onClick={() => handleOrderClick(order.id)}>
                                <ListItemIcon>
                                    <ReceiptLong fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={`Заказ #${order.id.toString().slice(-4)}`} 
                                    secondary={`${new Date(order.date).toLocaleDateString()} • $${Number(order.total).toFixed(2)}`} 
                                />
                                <ArrowForward fontSize="small" color="action" />
                            </MenuItem>
                        ))
                    )}

                    <Divider />
                    <MenuItem onClick={handleNavigateToOrders} sx={{ justifyContent: 'center', color: '#1976d2', fontWeight: 'bold' }}>
                        Смотреть все заказы
                    </MenuItem>
                </Menu>
            </>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <IconButton color="inherit" onClick={() => navigate("/cart")} sx={{ transition: "0.2s", '&:hover': { transform: "scale(1.1)" } }}>
          <Badge badgeContent={totalQty} color="error">
            <ShoppingCart sx={{ color: "white" }} />
          </Badge>
        </IconButton>

        {!user ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: 'white', textTransform: 'none' }}>Вход</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary" sx={{ borderRadius: '20px', textTransform: 'none' }}>Регистрация</Button>
            </Link>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, background: "rgba(255,255,255,0.1)", padding: "5px 15px", borderRadius: "30px" }}>
            <Link to={`/profile/${user.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
              <Typography sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
              <Avatar src={user.avatar ? user.avatar : defaultAvatar} alt={user.name} sx={{ width: 32, height: 32, border: "2px solid white" }} />
            </Link>
            
            <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.7)", '&:hover': { color: "white" } }}>
                <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}