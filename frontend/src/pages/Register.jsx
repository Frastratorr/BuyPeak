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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
        minHeight: "85vh",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          width: "100%", 
          maxWidth: 450, 
          borderRadius: 4,
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
          <PersonAddIcon fontSize="large" />
        </Avatar>

        <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Создание аккаунта
        </Typography>

        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          
          <TextField
            required
            fullWidth
            label="Ваше имя"
            value={name}
            onChange={e => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
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
            required
            fullWidth
            label="Придумайте пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
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
            sx={{ mt: 2, borderRadius: 2, height: 50, fontWeight: "bold", fontSize: "16px" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Зарегистрироваться"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?{" "}
              <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
                Войти
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}