import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Вход</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        <Button variant="contained" type="submit" size="large">Войти</Button>
      </form>
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </Typography>
    </Box>
  );
}
