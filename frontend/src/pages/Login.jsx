import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper, 
  Avatar,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Добавил состояние загрузки

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setLoading(false);
        return setError(data.error);
      }

      login(data);
      navigate(`/profile/${data.id}`);
    } catch {
      setError("Ошибка сервера. Попробуйте позже.");
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: "80vh", // На весь экран минус хедер
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)" // Легкий фон
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          width: "100%", 
          maxWidth: 400, 
          borderRadius: 4, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        {/* Иконка замка сверху */}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        
        <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Вход в систему
        </Typography>

        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email адрес"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, borderRadius: 2, height: 50, fontWeight: "bold" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Нет аккаунта?{" "}
              <Link to="/register" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}