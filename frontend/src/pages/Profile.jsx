import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
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
  Stack,
  InputAdornment,
  Divider,
  Card,
  CardContent
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
  const { user: currentUser, updateUser } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const { id: userIdParam } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [allReviews, setAllReviews] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  const isMyProfile = currentUser && (!userIdParam || String(userIdParam) === String(currentUser.id));

  useEffect(() => {
    let isMounted = true;
    const targetId = userIdParam || (currentUser && currentUser.id);

    if (!targetId) {
      if (isMounted) setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        if (isMounted) setLoading(true);

        const res = await fetch(`http://localhost:5000/users/${targetId}`);
        if (!res.ok) {
          if (isMounted) { setProfileUser(null); setLoading(false); }
          return;
        }

        const userData = await res.json();

        if (isMounted) {
          setProfileUser(userData);
          setName(userData.name || "Пользователь");
          setEmail(userData.email || "");
          setAvatar(userData.avatar || defaultAvatar);
          setBio(userData.bio || "");

          const reviewsRes = await fetch("http://localhost:5000/reviews");
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setAllReviews(reviewsData.filter(r => String(r.userId) === String(targetId)));
          }

          const ordersRes = await fetch(`http://localhost:5000/orders/${targetId}`);
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrdersCount(Array.isArray(ordersData) ? ordersData.length : 0);
          }
        }
      } catch (err) {
        console.error(err);
        showNotification("Не удалось загрузить данные", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { isMounted = false; };
  }, [userIdParam, currentUser]); 

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  if (!profileUser) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Профиль не найден</Typography>
        <Button onClick={() => { localStorage.clear(); window.location.href = "/"; }} sx={{ mt: 2 }}>Выйти</Button>
      </Box>
    );
  }

  const handleAvatarChange = (e) => {
    if (!isMyProfile) return;
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          showNotification("Файл слишком большой! Выберите фото до 2MB", "warning");
          return;
      }
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!isMyProfile) return;
    try {
      const updatedUser = { ...profileUser, name, email, avatar, bio };
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      updateUser(data);
      showNotification("Профиль успешно обновлён!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Ошибка сохранения", "error");
    }
  };

  const calculateDiscount = () => {
      const discount = ordersCount * 2; 
      return Math.min(discount, 20);
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
          {isMyProfile ? "Личный кабинет" : `Профиль: ${name}`}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 0, borderRadius: 4, mb: 4, overflow: 'hidden' }}>
        <Grid container>
            
            <Grid size={{ xs: 12, md: 4 }} sx={{ 
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
                        src={avatar || defaultAvatar} 
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

            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: '#444' }}>Статистика активности</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #e3f2fd', textAlign: 'center', height: '100%' }}>
                            <ShoppingBagIcon sx={{ fontSize: 36, color: '#1976d2', mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold" color="primary">{ordersCount}</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>Заказов</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #e8f5e9', textAlign: 'center', height: '100%' }}>
                            <LocalOfferIcon sx={{ fontSize: 36, color: '#2e7d32', mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#2e7d32' }}>{calculateDiscount()}%</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>Скидка</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: '1px solid #fff3e0', textAlign: 'center', height: '100%' }}>
                            <CalendarMonthIcon sx={{ fontSize: 36, color: '#ef6c00', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ef6c00', mt: 1 }}>
                                {profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : "2024"}
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
            <Grid size={{ xs: 12 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <EditIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Редактировать профиль</Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                                label="Имя" fullWidth value={name} onChange={e => setName(e.target.value)} 
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment> }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                                label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment> }} 
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                label="Биография (обновится слева)" multiline rows={3} fullWidth placeholder="Напишите о себе..."
                                value={bio} onChange={e => setBio(e.target.value)} 
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" size="large" startIcon={<SaveIcon />} onClick={handleSave} sx={{ borderRadius: 2, fontWeight: 'bold', px: 4 }}>
                                Сохранить изменения
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )}

        <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArticleIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Мои отзывы</Typography>
                        <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {allReviews.length}
                        </Box>
                    </Box>
                </Box>

                {allReviews.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f9f9f9', borderRadius: 4, border: '1px dashed #ddd' }}>
                    <HistoryIcon sx={{ fontSize: 50, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary" fontSize={16}>Вы еще не оставляли отзывов</Typography>
                </Box>
                ) : (
                <Grid container spacing={3}>
                    {allReviews.map(r => (
                    <Grid size={{ xs: 12, md: 6 }} key={r.id}>
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
                                        <Avatar sx={{ width: 30, height: 30, bgcolor: '#1976d2', fontSize: 14 }}>
                                            {r.nickname ? r.nickname[0].toUpperCase() : "U"}
                                        </Avatar>
                                        <Typography fontWeight="bold">{r.nickname}</Typography>
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