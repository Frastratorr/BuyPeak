import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, CardMedia, IconButton, TextField, Rating } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ReviewsBlock from "../components/ReviewsBlock";
import defaultAvatar from "../assets/img/default-avatar.jpg";
import { productsData } from "../data/products";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  const product = productsData.find(p => p.id === Number(id));
  if (!product) return <Typography variant="h5">Товар не найден</Typography>;

  // Загрузка отзывов с сервера по productId
  useEffect(() => {
    fetch(`http://localhost:5000/reviews/product/${product.id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Failed to load reviews:", err));
  }, [product.id]);

  // Добавление нового отзыва через сервер
  const handleAddReview = async () => {
    if (!newReview.trim()) return showNotification("Введите текст отзыва!");
    if (!newRating) return showNotification("Выберите рейтинг!");

    const newItem = {
      text: newReview,
      rating: newRating,
      nickname: user?.name || "Гость",
      avatar: user?.avatar || defaultAvatar,
      userId: user?.id || `guest-${Date.now()}`,
      date: Date.now(),
      productId: product.id,
    };

    try {
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const savedReview = await res.json();
      setReviews(prev => [...prev, savedReview]);
      setNewReview("");
      setNewRating(0);
      showNotification("Отзыв добавлен!");
    } catch (err) {
      console.error("Failed to save review:", err);
      showNotification("Не удалось сохранить отзыв!");
    }
  };

  const handleAdd = () => setQuantity(prev => prev + 1);
  const handleRemove = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleBuy = () => {
    addToCart({ ...product, quantity });
    const history = JSON.parse(localStorage.getItem("purchase_history") || "[]");
    localStorage.setItem(
      "purchase_history",
      JSON.stringify([...history, { ...product, quantity, date: Date.now(), userId: user?.id || "guest" }])
    );
    showNotification(`Добавлено ${quantity} шт. "${product.name}" в корзину!`);
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 3 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Левая часть: картинка, рейтинг и отзывы */}
        <Box sx={{ flex: "1 1 350px", minWidth: 300 }}>
          <CardMedia
            component="img"
            image={product.image || "/placeholder.png"}
            alt={product.name}
            sx={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
          />
          <Box sx={{ mt: 2 }}>
            <Rating value={averageRating} readOnly size="large" />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {reviews.length} отзыв{reviews.length === 1 ? "" : "ов"}
            </Typography>
          </Box>

          <ReviewsBlock
            reviews={reviews}
            saveReviews={setReviews} // локальное состояние уже обновляется при добавлении
            currentUser={user}
          />
        </Box>

        {/* Правая часть: описание, количество, кнопки */}
        <Box sx={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2e7d32" }}>{product.price}$</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleRemove} color="primary"><Remove /></IconButton>
            <TextField
              value={quantity}
              size="small"
              sx={{ width: 60 }}
              inputProps={{ style: { textAlign: "center" } }}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) setQuantity(val);
              }}
            />
            <IconButton onClick={handleAdd} color="primary"><Add /></IconButton>
          </Box>

          <Button variant="contained" size="large" sx={{ width: "60%", mt: 1 }} onClick={handleBuy}>Купить</Button>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Описание</Typography>
            <Typography sx={{ opacity: 0.9 }}>{product.description || "Описание будет добавлено позже."}</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6">Добавить отзыв:</Typography>
            <Rating value={newRating} onChange={(e, val) => setNewRating(val)} />
            <TextField
              label="Комментарий"
              multiline
              rows={3}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddReview}>Отправить отзыв</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
