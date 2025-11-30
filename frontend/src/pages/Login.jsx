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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users_db") || "[]");
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      setError("Неверный email или пароль");
      return;
    }

    login(foundUser);
    navigate(`/profile/${foundUser.id}`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Вход</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        <Button type="submit" variant="contained">Войти</Button>
      </form>
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </Typography>
    </Box>
  );
}
