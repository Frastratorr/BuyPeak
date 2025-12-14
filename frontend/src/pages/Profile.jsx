import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, Typography, Button, TextField, Avatar, Rating, CircularProgress, 
  Container, Grid, Paper, IconButton, Divider, Stack 
} from "@mui/material";
import { useNotification } from "../context/NotificationContext";
import SaveIcon from '@mui/icons-material/Save';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Profile() {
  // 🔥 ЖЕСТКАЯ ССЫЛКА НА БЭКЕНД
  const API_URL = "https://buypeak.onrender.com"; 
  
  // НАСТРОЙКИ CLOUDINARY
  const CLOUD_NAME = "dg2pcfylr"; 
  const UPLOAD_PRESET = "ml_default"; 

  const defaultAvatar = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/default-avatar.jpg`;

  const { user: currentUser, updateUser } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const { id: userIdParam } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);
  
  const [reviews, setReviews] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const isMyProfile = currentUser && (!userIdParam || String(userIdParam) === String(currentUser.id));

  useEffect(() => {
    const targetId = userIdParam || (currentUser && currentUser.id);

    if (!targetId) {
       if (!currentUser) navigate("/login");
       setLoading(false);
       return;
    }

    setLoading(true);

    // 1. Загрузка профиля
    fetch(`${API_URL}/users/${targetId}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => {
        setProfileUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        const incomingAvatar = data.avatar;
        const isValidId = incomingAvatar && (incomingAvatar.startsWith("http") || incomingAvatar.startsWith("data:"));
        setAvatar(isValidId ? incomingAvatar : defaultAvatar);
      })
      .catch(() => setProfileUser(null))
      .finally(() => setLoading(false));

    // 2. Загрузка отзывов
    fetch(`${API_URL}/reviews`)
      .then(res => res.json())
      .then(data => {
        const userReviews = data.filter(r => String(r.userId) === String(targetId));
        setReviews(userReviews);
      })
      .catch(console.error);

    // 3. Загрузка заказов
    if (isMyProfile) {
        fetch(`${API_URL}/orders/${targetId}`)
            .then(res => res.json())
            .then(data => setPurchaseHistory(data))
            .catch(console.error);
    }
  }, [userIdParam, currentUser, isMyProfile, navigate]);

  const handleAvatarChange = async (e) => {
    if (!isMyProfile) return;
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showNotification("Файл слишком большой! (макс 5MB)", "warning");
        return;
    }

    setIsUploading(true);

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
            setAvatar(data.secure_url);
            showNotification("Фото загружено! Нажмите 'Сохранить'", "success");
        } else {
            throw new Error("Не удалось получить ссылку");
        }
    } catch (err) {
        console.error(err);
        showNotification(`Ошибка загрузки: ${err.message}`, "error");
    } finally {
        setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!isMyProfile) return;
    if (isUploading) return showNotification("Дождитесь загрузки фото...", "warning");

    try {
      const updatedUser = { ...profileUser, name, email, avatar, bio };
      const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
        showNotification("Профиль обновлён!", "success");
      } else {
        showNotification("Ошибка сервера", "error");
      }
    } catch (err) {
      showNotification("Ошибка сохранения", "error");
    }
  };

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
  if (!profileUser) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Пользователь не найден</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)", py: 6 }}>
      <Container maxWidth={false} sx={{ maxWidth: "95%" }}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={2.5}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: "32px", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.6)", display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'sticky', top: 20 }}>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        {isUploading ? <CircularProgress /> : <Avatar src={avatar} sx={{ width: 130, height: 130, border: "6px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />}
                        {isMyProfile && !isUploading && (
                            <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                <CameraAltIcon color="primary" fontSize="small" />
                                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant="h5" fontWeight="800" gutterBottom>{name || "Без имени"}</Typography>
                    {email && isMyProfile && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{email}</Typography>}
                    <Divider sx={{ width: '100%', my: 3 }} />
                    {isMyProfile ? (
                        <Box sx={{ width: '100%' }}>
                            <TextField label="Имя" fullWidth margin="dense" size="small" value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField label="Email" fullWidth margin="dense" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <TextField label="О себе" multiline rows={4} fullWidth margin="dense" size="small" value={bio} onChange={(e) => setBio(e.target.value)} />
                            <Button variant="contained" fullWidth onClick={handleSave} startIcon={isUploading ? <CloudUploadIcon/> : <SaveIcon />} disabled={isUploading} sx={{ mt: 3, borderRadius: "16px" }}>{isUploading ? "Загрузка..." : "Сохранить"}</Button>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>{bio || "Нет информации"}</Typography>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12} md={9.5}>
                <Stack spacing={4}>
                    {isMyProfile && (
                        <Paper elevation={0} sx={{ p: 4, borderRadius: "32px", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.6)" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <ShoppingBagIcon color="primary" /> <Typography variant="h5" fontWeight="bold">Мои заказы</Typography>
                            </Box>
                            {purchaseHistory.length === 0 ? <Typography color="text.secondary" align="center" py={4}>Список заказов пуст</Typography> : 
                                <Stack spacing={3}>
                                    {purchaseHistory.map((order) => (
                                        <Box key={order.id} sx={{ width: "100%", p: 3, borderRadius: "24px", background: "white", border: "1px solid #f0f0f0", transition: "0.2s", display: "flex", flexDirection: "column", gap: 2, "&:hover": { boxShadow: "0 8px 25px rgba(0,0,0,0.05)" } }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography fontWeight="800">Заказ #{order.id}</Typography>
                                                <Box sx={{ bgcolor: "#e3f2fd", color: "#1976d2", px: 2, py: 0.8, borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>{new Date(order.date).toLocaleDateString()}</Box>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h5" color="primary" fontWeight="900">${order.total}</Typography>
                                                <Typography variant="body1" fontWeight="600" sx={{ textTransform: "capitalize", color: order.status === 'delivered' ? 'green' : 'orange' }}>{order.status}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            }
                        </Paper>
                    )}
                    <Paper elevation={0} sx={{ p: 5, minHeight: "600px", pb: 8, borderRadius: "32px", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.6)" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                             <RateReviewIcon color="secondary" /> <Typography variant="h5" fontWeight="bold">Отзывы</Typography>
                        </Box>
                        {reviews.length === 0 ? <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">Отзывов пока нет</Typography></Box> : 
                            <Stack spacing={3}>
                                {reviews.map(r => (
                                    <Box key={r.id} sx={{ p: 3, borderRadius: "24px", background: "rgba(255,255,255,0.7)", border: "1px solid #fff", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar src={r.avatar || defaultAvatar} sx={{ width: 40, height: 40 }} />
                                                <Box><Typography fontWeight="bold">{r.nickname || profileUser.name}</Typography><Rating value={r.rating || 0} readOnly size="small" /></Box>
                                            </Box>
                                            <Typography variant="caption" sx={{ bgcolor: "rgba(0,0,0,0.04)", px: 1.5, py: 0.5, borderRadius: "8px" }}>{new Date(r.date).toLocaleDateString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1, pl: 1 }}>
                                            <FormatQuoteIcon sx={{ color: "#e0e0e0", transform: "rotate(180deg)" }} />
                                            <Typography variant="body1" sx={{ color: "#555", fontStyle: "italic", flex: 1 }}>{r.text}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        }
                    </Paper>
                </Stack>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}