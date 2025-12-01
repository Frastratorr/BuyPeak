import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error);

      login(data);
      navigate(`/profile/${data.id}`);
    } catch {
      setError("Ошибка сервера");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, width: 400, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>Регистрация</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField label="Имя" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" type="email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Пароль" type="password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>Зарегистрироваться</Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center", fontSize: 14 }}>
          Уже есть аккаунт? <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>Войти</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
