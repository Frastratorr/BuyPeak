import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Box, Avatar, Button, Typography, IconButton, Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProfileClick = () => {
    if (user) navigate(`/profile/${user.id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "white",
      }}
    >
      {/* Левое меню */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="h6">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            BuyPeak
          </Link>
        </Typography>
        <Link to="/catalog" style={{ textDecoration: "none", color: "white" }}>
          Каталог
        </Link>
      </Box>

      {/* Правое меню */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {/* Иконка корзины с количеством */}
        <IconButton color="inherit" onClick={() => navigate("/cart")}>
          <Badge badgeContent={totalQty} color="error">
            <ShoppingCart sx={{ color: "white" }} />
          </Badge>
        </IconButton>

        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary">
                Login
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary">
                Register
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Ник и аватарка ведут на профиль */}
            <Typography 
              component={Link} 
              to={`/profile/${user.id}`} 
              sx={{ textDecoration: "none", color: "white", fontSize: 21 }}
            >
              {user.name || "Гость"}
            </Typography>
            <Avatar 
              component={Link} 
              to={`/profile/${user.id}`} 
              src={user.avatar || defaultAvatar} 
              alt={user.name} 
              sx={{ width: 35, height: 35, cursor: "pointer" }}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={logout}
              sx={{ ml: 1 }}
            >
              Logout
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
