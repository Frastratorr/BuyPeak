import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Typography, CardMedia, IconButton, TextField, Rating } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { productsData } from "../data/products";
import { useNotification } from "../context/NotificationContext";
import defaultAvatar from "../assets/img/default-avatar.jpg";
import ReviewsBlock from "../components/ReviewsBlock";

export default function Product() {
  const { id } = useParams();
  const product = productsData.find(p => p.id === Number(id));
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${product.id}`);
    if (saved) setReviews(JSON.parse(saved));
  }, [product.id]);

  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
  };

  const handleBuy = () => {
    addToCart({ ...product, quantity });
    const history = JSON.parse(localStorage.getItem("purchase_history") || "[]");
    localStorage.setItem("purchase_history", JSON.stringify([...history, { ...product, quantity, date: Date.now(), userId: user.id }]));
    showNotification(`Добавлено ${quantity} шт. "${product.name}" в корзину!`);
  };

  const handleAddReview = () => {
    if (!newReview.trim()) return showNotification("Введите текст отзыва!");
    if (!newRating) return showNotification("Выберите рейтинг!");

    const newItem = {
      id: Date.now(),
      text: newReview,
      rating: newRating,
      nickname: user?.name || "Гость",
      avatar: user?.avatar || defaultAvatar,
      userId: user?.id || `guest-${Date.now()}`,
      date: Date.now(),
      likes: 0,
      likeBy: []
    };

    saveReviews([...reviews, newItem]);
    setNewReview("");
    setNewRating(0);
    showNotification("Отзыв добавлен!");
  };

  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  if (!product) return <Typography variant="h5">Товар не найден</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 3 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Box sx={{ flex: "1 1 350px", minWidth: 300 }}>
          <CardMedia component="img" image={product.image || "/placeholder.png"} alt={product.name} sx={{ width: "100%", borderRadius: "12px", objectFit: "cover" }} />
          <Box sx={{ mt: 2 }}>
            <Rating value={averageRating} readOnly size="large" />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {reviews.length} отзыв{reviews.length === 1 ? "" : "ов"}
            </Typography>
          </Box>
          <ReviewsBlock reviews={reviews} saveReviews={saveReviews} currentUser={user} />
        </Box>

        <Box sx={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2e7d32" }}>{product.price}$</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} color="primary"><Remove /></IconButton>
            <TextField value={quantity} size="small" sx={{ width: 60 }} inputProps={{ style: { textAlign: "center" } }} onChange={(e) => { const val = parseInt(e.target.value); if (!isNaN(val) && val > 0) setQuantity(val); }} />
            <IconButton onClick={() => setQuantity(prev => prev + 1)} color="primary"><Add /></IconButton>
          </Box>

          <Button variant="contained" size="large" sx={{ width: "60%", mt: 1 }} onClick={handleBuy}>Купить</Button>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Описание</Typography>
            <Typography sx={{ opacity: 0.9 }}>{product.description || "Описание будет добавлено позже."}</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6">Добавить отзыв:</Typography>
            <Rating value={newRating} onChange={(e, val) => setNewRating(val)} />
            <TextField label="Комментарий" multiline rows={3} value={newReview} onChange={(e) => setNewReview(e.target.value)} />
            <Button variant="contained" onClick={handleAddReview}>Отправить отзыв</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
