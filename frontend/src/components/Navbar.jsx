import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Box, Avatar, Button, Typography, IconButton, Badge } from "@mui/material";
// Добавили иконки:
import { ShoppingCart, Category as CategoryIcon, Logout as LogoutIcon } from "@mui/icons-material";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        borderRadius: "2",
      }}
    >
      {/* Левое меню */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Typography 
            variant="h5" 
            sx={{ fontWeight: "bold", letterSpacing: "1px" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>BuyPeak</Link>
        </Typography>
        
        {/* --- 🔥 ОБНОВЛЕННАЯ КНОПКА КАТАЛОГА --- */}
        <Button
          component={Link}
          to="/catalog"
          startIcon={<CategoryIcon />} // Иконка категорий
          variant="outlined" // Делаем кнопку с рамкой
          sx={{
            color: "white",
            borderColor: "rgba(255,255,255,0.5)",
            textTransform: "none", // Убираем CAPS LOCK
            fontSize: "16px",
            borderRadius: "20px", // Закругленные края
            padding: "5px 20px",
            transition: "all 0.3s ease",
            '&:hover': {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.15)", // Подсветка при наведении
              transform: "translateY(-2px)" // Легкое всплытие
            }
          }}
        >
          Каталог
        </Button>
        {/* -------------------------------------- */}
      </Box>

      {/* Правое меню */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        
        {/* Корзина */}
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
            {/* Ник и аватарка */}
            <Link to={`/profile/${user.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
              <Typography sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
              <Avatar src={user.avatar ? user.avatar : defaultAvatar} alt={user.name} sx={{ width: 32, height: 32, border: "2px solid white" }} />
            </Link>
            
            {/* Кнопка выхода (только иконка для компактности) */}
            <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.7)", '&:hover': { color: "white" } }}>
                <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}