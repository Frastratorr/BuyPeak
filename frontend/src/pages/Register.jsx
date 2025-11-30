import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    const usersDb = JSON.parse(localStorage.getItem("users_db") || "[]");
    if (usersDb.find(u => u.email === email)) {
      setError("Пользователь с таким Email уже существует");
      return;
    }

    const newUser = { id: Date.now(), name, email, password, avatar: null, bio: "" };
    usersDb.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(usersDb));

    login(newUser);
    navigate(`/profile/${newUser.id}`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Регистрация</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <TextField label="Имя" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
          <TextField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained">Зарегистрироваться</Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
