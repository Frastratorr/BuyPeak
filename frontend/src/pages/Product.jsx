import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { 
  Box, Button, Typography, CardMedia, IconButton, TextField, 
  Rating, Paper, Chip, Divider, Stack, CircularProgress
} from "@mui/material";
import { 
  Add, Remove, ShoppingCart, 
} from "@mui/icons-material";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ReviewsBlock from "../components/ReviewsBlock";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Товар не найден");
        return res.json();
      })
      .then(data => {
        setProduct(data);
      })
      .catch(err => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    
    const pid = product.id || product._id;
    
    fetch(`${API_URL}/reviews/product/${pid}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [product]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  if (!product) return <Box sx={{ p: 5, textAlign: 'center' }}><Typography variant="h4" color="error">Товар не найден</Typography></Box>;

  const isOutOfStock = !product.quantity || product.quantity <= 0;
  const maxQuantity = product.quantity || 0;
  const priceDisplay = product.price;

  const handleAddReview = async () => {
    if (!newReview.trim()) return showNotification("Введите текст отзыва!", "warning");
    if (!newRating) return showNotification("Выберите рейтинг!", "warning");

    const pid = product.id || product._id;

    const newItem = {
      text: newReview,
      rating: newRating,
      nickname: user?.name || "Гость",
      avatar: user?.avatar || defaultAvatar,
      userId: user?.id || `guest-${Date.now()}`,
      date: Date.now(),
      productId: pid, 
    };

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Server Error Response:", errData);
        throw new Error(errData.error || "Ошибка сервера");
      }

      const savedReview = await res.json();
      
      setReviews(prev => [...prev, { 
          ...savedReview, 
          avatar: user?.avatar || savedReview.avatar,
          nickname: user?.name || savedReview.nickname
      }]);
      
      setNewReview("");
      setNewRating(0);
      showNotification("Отзыв успешно добавлен!", "success");
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      showNotification("Ошибка отправки отзыва", "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Удалить этот отзыв?")) return;
    try {
      await fetch(`${API_URL}/reviews/${reviewId}`, { method: "DELETE" });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      showNotification("Отзыв удален", "info");
    } catch (err) {
      showNotification("Ошибка удаления", "error");
    }
  };

  const handleAdd = () => { if (quantity < maxQuantity) setQuantity(prev => prev + 1); };
  const handleRemove = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleBuy = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, quantity });
    showNotification(`Добавлено ${quantity} шт. "${product.name}" в корзину!`, "success");
  };

  const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  return (
    <Box className="fade-in" sx={{ maxWidth: '1200px', mx: 'auto', padding: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Box sx={{ flex: "1 1 400px", minWidth: 300 }}>
          <CardMedia
            component="img"
            image={product.image || "/placeholder.png"}
            alt={product.name}
            sx={{ width: "100%", maxHeight: 500, objectFit: "contain", borderRadius: 4, mb: 3 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Rating value={averageRating} readOnly size="large" precision={0.5} />
            <Typography variant="h6" fontWeight="bold">{averageRating.toFixed(1)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>({reviews.length} отзывов)</Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Отзывы покупателей</Typography>
          <ReviewsBlock reviews={reviews} saveReviews={setReviews} currentUser={user} onDelete={handleDeleteReview} />
        </Box>
        
        <Box sx={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2027', lineHeight: 1.2 }}>{product.name}</Typography>
                <Chip label={isOutOfStock ? "Нет в наличии" : `В наличии: ${product.quantity}`} color={isOutOfStock ? "error" : "success"} variant={isOutOfStock ? "filled" : "outlined"} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: isOutOfStock ? "gray" : "#2563eb", mt: 2 }}>${priceDisplay}</Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: "flex", alignItems: "center", border: '1px solid #e0e0e0', borderRadius: '50px', px: 1 }}>
                    <IconButton onClick={handleRemove} color="primary" disabled={isOutOfStock || quantity <= 1}><Remove /></IconButton>
                    
                    <TextField 
                        value={quantity} 
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) setQuantity(val);
                        }}
                        variant="standard" 
                        disabled={isOutOfStock} 
                        InputProps={{ disableUnderline: true }} 
                        sx={{ 
                            width: 60, 
                            '& input': { 
                                textAlign: 'center', 
                                fontSize: '1.3rem', 
                                fontWeight: 'bold',
                                padding: 0
                            } 
                        }} 
                    />
                    
                    <IconButton onClick={handleAdd} color="primary" disabled={isOutOfStock || quantity >= maxQuantity}><Add /></IconButton>
                </Box>
                <Button variant="contained" size="large" startIcon={<ShoppingCart />} onClick={handleBuy} disabled={isOutOfStock} sx={{ flexGrow: 1, borderRadius: '50px', py: 1.5 }}>{isOutOfStock ? "Нет в наличии" : "Добавить в корзину"}</Button>
            </Box>
          </Box>
          
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold">Оставить отзыв</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Rating value={newRating} onChange={(e, val) => setNewRating(val)} size="large" />
                <TextField label="Комментарий..." multiline rows={3} fullWidth value={newReview} onChange={(e) => setNewReview(e.target.value)} />
                <Button variant="contained" onClick={handleAddReview} disabled={!user}>Отправить</Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}