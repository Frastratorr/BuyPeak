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
  // 🔥 ЖЕСТКАЯ ССЫЛКА НА БЭКЕНД
  const API_URL = "https://buypeak.onrender.com";

  // НАСТРОЙКИ CLOUDINARY
  const CLOUD_NAME = "dg2pcfylr"; 
  const UPLOAD_PRESET = "ml_default"; 

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
  
  const [productForm, setProductForm] = useState({ 
      name: "", price: "", quantity: "", image: "", description: "" 
  });

  useEffect(() => {
    // Проверка прав админа
    if (!user || (user.email !== "admin@gmail.com" && user.role !== "admin")) {
        navigate("/");
        return;
    }
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, [user]);

  // --- ЗАГРУЗКА ДАННЫХ ---
  const fetchProducts = () => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const fetchOrders = () => {
    fetch(`${API_URL}/admin/orders`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data.reverse() : []))
      .catch(console.error);
  };

  const fetchUsers = () => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsersList(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  // --- УПРАВЛЕНИЕ ТОВАРАМИ ---
  const handleOpenModal = (product = null) => {
    if (product) {
        setEditingProduct(product);
        setProductForm(product);
    } else {
        setEditingProduct(null);
        setProductForm({ name: "", price: "", quantity: "", image: "", description: "" });
    }
    setOpenProductModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); 
    formData.append("cloud_name", CLOUD_NAME); 

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
            setProductForm(prev => ({ ...prev, image: data.secure_url }));
            showNotification("Фото загружено!", "success");
        } else {
            throw new Error("Ошибка загрузки");
        }
    } catch (err) {
        showNotification("Ошибка загрузки фото", "error");
    } finally {
        setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    if (uploadingImage) return showNotification("Ждем загрузку фото...", "warning");

    const id = editingProduct ? (editingProduct.id || editingProduct._id) : null;
    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
    const method = editingProduct ? "PUT" : "POST";

    const dataToSend = {
        ...productForm,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity)
    };

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });
        if (res.ok) {
            showNotification(editingProduct ? "Товар обновлен" : "Товар добавлен", "success");
            setOpenProductModal(false);
            fetchProducts();
        }
    } catch (err) {
        showNotification("Ошибка сохранения", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Удалить этот товар?")) return;
    try {
        await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
        showNotification("Товар удален", "info");
        fetchProducts();
    } catch (err) {
        showNotification("Ошибка удаления", "error");
    }
  };

  // --- УПРАВЛЕНИЕ ЗАКАЗАМИ ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
        await fetch(`${API_URL}/admin/orders/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        showNotification("Статус обновлен", "success");
        fetchOrders();
    } catch (err) {
        showNotification("Ошибка обновления", "error");
    }
  };

  // --- УПРАВЛЕНИЕ ЮЗЕРАМИ ---
  const handleToggleAdmin = async (targetUser) => {
    if (targetUser.email === "admin@gmail.com") return showNotification("Нельзя изменить главного админа", "warning");
    const targetId = targetUser.id || targetUser._id;
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    
    try {
        await fetch(`${API_URL}/users/${targetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole })
        });
        showNotification(`Роль изменена на ${newRole}`, "success");
        fetchUsers();
    } catch (err) { showNotification("Ошибка", "error"); }
  };

  const handleToggleBlock = async (targetUser) => {
    if (targetUser.email === "admin@gmail.com") return showNotification("Нельзя заблокировать админа", "warning");
    if (String(targetUser.id) === String(user.id)) return showNotification("Нельзя заблокировать себя", "warning");
    
    const targetId = targetUser.id || targetUser._id;
    const newStatus = !targetUser.isBlocked;

    try {
        await fetch(`${API_URL}/users/${targetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: newStatus })
        });
        showNotification(newStatus ? "Заблокирован" : "Разблокирован", "info");
        fetchUsers();
    } catch (err) { showNotification("Ошибка", "error"); }
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#333" }}>
        Панель администратора
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 4, mb: 4 }}>
        <Tabs 
            value={tabIndex} 
            onChange={(e, v) => setTabIndex(v)} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
        >
            <Tab icon={<Inventory />} label={`Товары (${products.length})`} />
            <Tab icon={<ReceiptLong />} label={`Заказы (${orders.length})`} />
            <Tab icon={<People />} label={`Пользователи (${usersList.length})`} />
        </Tabs>
      </Paper>

      {/* ТАБ 1: ТОВАРЫ */}
      {tabIndex === 0 && (
        <Box>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenModal()}
                sx={{ mb: 4, borderRadius: 2 }}
            >
                Добавить новый товар
            </Button>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 6 }}>
                {products.map((p, index) => (
                    <Paper 
                        key={p.id || p._id || index}
                        elevation={3} 
                        sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                    >
                        <Box>
                            <CardMedia 
                                component="img" 
                                height="200" 
                                image={p.image || "https://placehold.co/200"} 
                                sx={{ borderRadius: 2, objectFit: 'contain', mb: 2 }} 
                            />
                            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 1 }}>{p.name}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">${p.price}</Typography>
                                <Chip label={`${p.quantity || 0} шт.`} size="small" color={p.quantity > 0 ? "success" : "error"} variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, height: 40, overflow: 'hidden' }}>{p.description}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} mt={2}>
                            <Button variant="outlined" startIcon={<EditIcon />} fullWidth onClick={() => handleOpenModal(p)} sx={{ borderRadius: 2 }}>Изменить</Button>
                            <IconButton color="error" onClick={() => handleDeleteProduct(p.id || p._id)} sx={{ bgcolor: '#ffebee' }}><DeleteIcon /></IconButton>
                        </Stack>
                    </Paper>
                ))}
            </Box>
        </Box>
      )}

      {/* ТАБ 2: ЗАКАЗЫ */}
      {tabIndex === 1 && (
        <Stack spacing={2}>
            {orders.length === 0 ? <Typography textAlign="center" color="text.secondary" mt={4}>Заказов пока нет</Typography> : 
                orders.map((order, index) => (
                    <Paper key={order.id || order._id || index} elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: '5px solid #1976d2' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">ID: {order.id}</Typography>
                                <Typography fontWeight="bold" variant="h6">{order.shippingInfo?.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{order.shippingInfo?.phone}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Сумма</Typography>
                                <Typography fontWeight="bold" color="primary" variant="h6">${Number(order.total).toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Дата</Typography>
                                <Typography variant="body1">{new Date(order.date).toLocaleDateString()}</Typography>
                            </Box>
                            <Box>
                                <Select 
                                    size="small" fullWidth value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    sx={{ borderRadius: 2, bgcolor: order.status === 'delivered' ? '#e8f5e9' : '#fff', fontWeight: 'bold' }}
                                >
                                    <MenuItem value="processing">🟡 В обработке</MenuItem>
                                    <MenuItem value="shipped">🔵 Отправлен</MenuItem>
                                    <MenuItem value="delivered">🟢 Доставлен</MenuItem>
                                    <MenuItem value="canceled">🔴 Отменен</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                            <Typography variant="body2" color="text.secondary">
                                <b>Адрес:</b> {order.shippingInfo?.country}, {order.shippingInfo?.city}, {order.shippingInfo?.address}
                            </Typography>
                        </Box>
                    </Paper>
                ))
            }
        </Stack>
      )}

      {/* ТАБ 3: ПОЛЬЗОВАТЕЛИ */}
      {tabIndex === 2 && (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
            <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                        <TableCell>Пользователь</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Админ</TableCell>
                        <TableCell>Блокировка</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usersList.map((u, index) => (
                        <TableRow key={u.id || u._id || index}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={u.avatar} alt={u.name} />
                                    <Typography fontWeight="bold">{u.name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Security color={u.role === 'admin' ? 'primary' : 'disabled'} />
                                    <Switch checked={u.role === 'admin'} onChange={() => handleToggleAdmin(u)} disabled={u.email === 'admin@gmail.com'} />
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Block color={u.isBlocked ? 'error' : 'disabled'} />
                                    <Switch checked={!!u.isBlocked} onChange={() => handleToggleBlock(u)} color="error" disabled={u.email === 'admin@gmail.com' || (String(u.id) === String(user.id))} />
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      )}

      {/* МОДАЛКА ПРОДУКТА */}
      <Dialog open={openProductModal} onClose={() => setOpenProductModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Редактировать товар" : "Новый товар"}</DialogTitle>
        <DialogContent>
            <Stack spacing={3} mt={1}>
                <Box sx={{ textAlign: 'center' }}>
                    {productForm.image && <CardMedia component="img" image={productForm.image} sx={{ width: 120, height: 120, objectFit: 'contain', mx: 'auto', mb: 2, borderRadius: 2 }} />}
                    <Button variant="outlined" component="label" startIcon={uploadingImage ? <CircularProgress size={20} /> : <UploadIcon />} disabled={uploadingImage}>
                        {uploadingImage ? "Загрузка..." : "Загрузить фото"}
                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </Button>
                </Box>
                <TextField label="Название" fullWidth value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Цена ($)" type="number" fullWidth value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                    <TextField label="Количество" type="number" fullWidth value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} />
                </Box>
                <TextField label="Или ссылка на фото (URL)" fullWidth value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} disabled={uploadingImage} />
                <TextField label="Описание" multiline rows={3} fullWidth value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenProductModal(false)}>Отмена</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveProduct} disabled={uploadingImage}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}