import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Avatar, 
  Rating, 
  CircularProgress, 
  Grid, 
  Paper, 
  IconButton, 
  Badge, 
  InputAdornment, 
  Divider, 
  Card, 
  CardContent,
  Stack
} from "@mui/material";
import defaultAvatar from "../assets/img/default-avatar.jpg";
import { useNotification } from "../context/NotificationContext";

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export default function Profile() {
  const DEFAULT_AVATAR = "https://res.cloudinary.com/dg2pcfylr/image/upload/v1765308214/default-avatar_e3ep28.jpg";
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
  const { user: currentUser, updateUser } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const { id: userIdParam } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [isUploading, setIsUploading] = useState(false);
  
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
        const isValidUrl = incomingAvatar && (incomingAvatar.startsWith("http") || incomingAvatar.startsWith("data:"));
        setAvatar(isValidUrl ? incomingAvatar : DEFAULT_AVATAR);
      })
      .catch(() => setProfileUser(null))
      .finally(() => setLoading(false));

    fetch(`${API_URL}/reviews`)
      .then(res => res.json())
      .then(data => {
        const userReviews = data.filter(r => String(r.userId) === String(targetId));
        setReviews(userReviews);
      })
      .catch(console.error);

    if (isMyProfile || targetId) {
        fetch(`${API_URL}/orders/${targetId}`)
            .then(res => res.json())
            .then(data => setPurchaseHistory(Array.isArray(data) ? data : []))
            .catch(console.error);
    }
  }, [userIdParam, currentUser, isMyProfile, navigate]);

  const handleAvatarChange = async (e) => {
    if (!isMyProfile) return;
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showNotification("Файл слишком большой! (макс 2MB)", "warning");
        return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_defaultS");
    formData.append("cloud_name", "dg2pcfylr");

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dg2pcfylr/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.secure_url) {
            setAvatar(data.secure_url);
            showNotification("Фото загружено! Не забудьте нажать 'Сохранить'", "success");
        } else {
            throw new Error("Ошибка Cloudinary");
        }
    } catch (err) {
        console.error(err);
        showNotification("Ошибка загрузки фото", "error");
    } finally {
        setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!isMyProfile) return;
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
        showNotification("Профиль успешно обновлён!", "success");
      } else {
        showNotification("Ошибка сервера", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Ошибка сохранения", "error");
    }
  };

  const calculateDiscount = () => {
      const count = purchaseHistory.length;
      const discount = count * 2; 
      return Math.min(discount, 20);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!profileUser) return <Box sx={{ mt: 10, textAlign: 'center' }}><Typography variant="h5">Профиль не найден</Typography></Box>;

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
          {isMyProfile ? "Личный кабинет" : `Профиль: ${name}`}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 0, borderRadius: 4, mb: 4, overflow: 'hidden' }}>
        <Grid container>
            
            <Grid item xs={12} md={4} sx={{ 
                borderRight: { md: '1px solid #eee' }, 
                bgcolor: '#fafafa',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isMyProfile && (
                        <IconButton 
                            component="label" 
                            sx={{ bgcolor: '#1976d2', color: 'white', width: 36, height: 36, '&:hover': { bgcolor: '#115293' } }}
                        >
                          <PhotoCamera fontSize="small" />
                          <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar 
                        src={avatar} 
                        sx={{ width: 140, height: 140, border: "6px solid white", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} 
                    />
                  </Badge>
                </Box>
                
                <Typography variant="h4" fontWeight="bold" align="center" color="#333">{name}</Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>{email}</Typography>
                
                <Divider flexItem sx={{ mb: 3 }} />

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
                        <InfoIcon color="action" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">О себе</Typography>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ fontStyle: bio ? 'normal' : 'italic', color: bio ? 'text.primary' : 'text.disabled', lineHeight: 1.6 }}>
                        {bio || "Биография не заполнена."}
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12} md={8} sx={{ p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: '#444' }}>Статистика активности</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #e3f2fd', textAlign: 'center', height: '100%' }}>
                            <ShoppingBagIcon sx={{ fontSize: 36, color: '#1976d2', mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold" color="primary">{purchaseHistory.length}</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>Заказов</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #e8f5e9', textAlign: 'center', height: '100%' }}>
                            <LocalOfferIcon sx={{ fontSize: 36, color: '#2e7d32', mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#2e7d32' }}>{calculateDiscount()}%</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>Ваша Скидка</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #fff3e0', textAlign: 'center', height: '100%' }}>
                            <CalendarMonthIcon sx={{ fontSize: 36, color: '#ef6c00', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ef6c00', mt: 1 }}>
                                {profileUser.createdAt ? new Date(Number(profileUser.createdAt) || Date.now()).getFullYear() : "2024"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>Регистрация</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        
        {isMyProfile && (
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <EditIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Редактировать профиль</Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Имя" fullWidth value={name} onChange={e => setName(e.target.value)} 
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment> }} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Биография (обновится слева)" multiline rows={3} fullWidth placeholder="Напишите о себе..."
                                value={bio} onChange={e => setBio(e.target.value)} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleSave} sx={{ borderRadius: 2, fontWeight: 'bold', px: 4 }}>
                                Сохранить изменения
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )}

        {isMyProfile && purchaseHistory.length > 0 && (
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <ShoppingBagIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">История заказов</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {purchaseHistory.map((order) => (
                            <Grid item xs={12} md={6} key={order.id}>
                                <Box sx={{ 
                                    p: 3, 
                                    borderRadius: 3, 
                                    border: "1px solid #eee", 
                                    bgcolor: '#fff',
                                    transition: '0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, borderColor: '#1976d2' }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography fontWeight="bold">Заказ #{order.id}</Typography>
                                        <Typography variant="body2" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1, borderRadius: 1 }}>
                                            {new Date(order.date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" color="primary" fontWeight="bold">${order.total}</Typography>
                                        <Typography variant="body2" sx={{ 
                                            textTransform: "capitalize", 
                                            color: order.status === 'delivered' ? 'green' : 'orange',
                                            fontWeight: 'bold'
                                        }}>
                                            {order.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
        )}

        <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArticleIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Отзывы</Typography>
                        <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {reviews.length}
                        </Box>
                    </Box>
                </Box>

                {reviews.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f9f9f9', borderRadius: 4, border: '1px dashed #ddd' }}>
                    <HistoryIcon sx={{ fontSize: 50, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary" fontSize={16}>Вы еще не оставляли отзывов</Typography>
                </Box>
                ) : (
                <Grid container spacing={3}>
                    {reviews.map(r => (
                    <Grid item xs={12} md={6} key={r.id}>
                        <Card sx={{ 
                            height: '100%', 
                            borderRadius: 3, 
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)", 
                            border: '1px solid #eee',
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: "0 5px 20px rgba(0,0,0,0.1)", borderColor: '#1976d2' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Avatar src={r.avatar} sx={{ width: 30, height: 30 }} />
                                        <Typography fontWeight="bold">{r.nickname || "Пользователь"}</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {r.date ? new Date(r.date).toLocaleDateString() : ""}
                                    </Typography>
                                </Box>
                                
                                <Rating value={Number(r.rating) || 0} readOnly size="small" sx={{ mb: 2 }} />
                                
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <FormatQuoteIcon sx={{ color: '#e0e0e0', transform: 'rotate(180deg)' }} />
                                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontStyle: 'italic', color: '#555' }}>
                                        {r.text}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}