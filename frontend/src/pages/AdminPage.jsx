import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Tabs, Tab, Button, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  Stack, CardMedia, Avatar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Switch, Chip, CircularProgress
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Inventory,
  ReceiptLong, Save as SaveIcon, CloudUpload as UploadIcon,
  People, Security, Block
} from "@mui/icons-material";

export default function AdminPage() {
  // 🔥 ЖЕСТКАЯ ССЫЛКА
  const API_URL = "https://buypeak.onrender.com";

  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", price: "", quantity: "", image: "", description: "" });

  useEffect(() => {
    if (!user || (user.email !== "admin@gmail.com" && user.role !== "admin")) {
        navigate("/");
        return;
    }
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, [user]);

  const fetchProducts = () => {
    fetch(`${API_URL}/products`).then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(console.error);
  };
  const fetchOrders = () => {
    fetch(`${API_URL}/admin/orders`).then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data.reverse() : [])).catch(console.error);
  };
  const fetchUsers = () => {
    fetch(`${API_URL}/users`).then(res => res.json()).then(data => setUsersList(Array.isArray(data) ? data : [])).catch(console.error);
  };

  // ... (Остальные функции handleSaveProduct, handleImageUpload и т.д. остаются без изменений, главное - проверь чтобы URL при сохранении тоже использовал API_URL, а не localhost) ...
  // Я приведу сокращенно render, но функции fetch внутри должны использовать API_URL!

  const handleSaveProduct = async () => {
    const id = editingProduct ? (editingProduct.id || editingProduct._id) : null;
    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
    const method = editingProduct ? "PUT" : "POST";
    const dataToSend = { ...productForm, price: Number(productForm.price), quantity: Number(productForm.quantity) };

    try {
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dataToSend) });
        if (res.ok) {
            showNotification(editingProduct ? "Товар обновлен" : "Товар добавлен", "success");
            setOpenProductModal(false);
            fetchProducts();
        }
    } catch (err) { showNotification("Ошибка сохранения", "error"); }
  };

  // ... (Остальной код рендера)
  // Убедись, что handleImageUpload использует твой Cloudinary напрямую, это ок.
  
  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#333" }}>Панель администратора</Typography>
      <Paper elevation={3} sx={{ borderRadius: 4, mb: 4 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="fullWidth" textColor="primary" indicatorColor="primary">
            <Tab icon={<Inventory />} label={`Товары (${products.length})`} />
            <Tab icon={<ReceiptLong />} label={`Заказы (${orders.length})`} />
            <Tab icon={<People />} label={`Пользователи (${usersList.length})`} />
        </Tabs>
      </Paper>
      {/* ... Контент табов ... */}
      {/* Я не дублирую весь JSX, он у тебя есть, главное измени API_URL в начале файла! */}
      {/* Вставь свой JSX из предыдущего сообщения, но с const API_URL = "https://buypeak.onrender.com"; */}
    </Box>
  );
}