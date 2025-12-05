import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  CardMedia, 
  IconButton, 
  TextField, 
  Rating, 
  Paper, 
  Chip, 
  Divider, 
  Stack,
  CircularProgress
} from "@mui/material";
import { 
  Add, 
  Remove, 
  ShoppingCart, 
  Send as SendIcon, 
  LocalOffer, 
  Description as DescriptionIcon,
  RateReview as RateReviewIcon,
  Block as BlockIcon
} from "@mui/icons-material";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ReviewsBlock from "../components/ReviewsBlock";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function Product() {
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
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => String(p.id) === String(id));
        setProduct(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    fetch(`http://localhost:5000/reviews/product/${product.id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(console.error);
  }, [product]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  if (!product) return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Typography variant="h4" color="error">Товар не найден</Typography>
    </Box>
  );

  const isOutOfStock = !product.quantity || product.quantity <= 0;
  const maxQuantity = product.quantity || 0;

  const handleAddReview = async () => {
    if (!newReview.trim()) return showNotification("Введите текст отзыва!", "warning");
    if (!newRating) return showNotification("Выберите рейтинг!", "warning");

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
      showNotification("Отзыв успешно добавлен!", "success");
    } catch (err) {
      console.error("Failed to save review:", err);
      showNotification("Не удалось сохранить отзыв!", "error");
    }
  };

  const handleAdd = () => {
      if (quantity < maxQuantity) setQuantity(prev => prev + 1);
  };
  
  const handleRemove = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleBuy = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, quantity });
    showNotification(`Добавлено ${quantity} шт. "${product.name}" в корзину!`, "success");
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0;

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', padding: { xs: 2, md: 4 } }}>
      
      <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "flex-start" }}>
        
        <Box sx={{ flex: "1 1 400px", minWidth: 300 }}>
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
            <CardMedia
              component="img"
              image={product.image || "/placeholder.png"}
              alt={product.name}
              sx={{ 
                width: "100%", 
                maxHeight: 500, 
                objectFit: "contain",
                p: 2,
                bgcolor: "white",
                transition: "transform 0.3s",
                '&:hover': { transform: "scale(1.02)" },
                filter: isOutOfStock ? "grayscale(100%)" : "none",
                opacity: isOutOfStock ? 0.7 : 1
              }}
            />
          </Paper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Rating value={averageRating} readOnly size="large" precision={0.5} />
            <Typography variant="h6" fontWeight="bold">
                {averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
              ({reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"})
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Отзывы покупателей</Typography>
          <ReviewsBlock
            reviews={reviews}
            saveReviews={setReviews}
            currentUser={user}
          />
        </Box>

        <Box sx={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 3 }}>
          
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2027', lineHeight: 1.2 }}>
                    {product.name}
                </Typography>
                <Chip 
                    label={isOutOfStock ? "Нет в наличии" : `В наличии: ${product.quantity}`} 
                    color={isOutOfStock ? "error" : "success"} 
                    variant={isOutOfStock ? "filled" : "outlined"}
                    icon={isOutOfStock ? <BlockIcon /> : undefined}
                    sx={{ fontWeight: 'bold', height: 32 }} 
                />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Артикул: {product.id}
            </Typography>

            <Typography variant="h3" sx={{ fontWeight: 700, color: isOutOfStock ? "gray" : "#2563eb", display: 'flex', alignItems: 'center', gap: 1 }}>
              ${product.price}
              {!isOutOfStock && <LocalOffer sx={{ fontSize: 30, opacity: 0.5 }} />}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color={isOutOfStock ? "error" : "textPrimary"}>
                {isOutOfStock ? "Этот товар закончился" : "Количество:"}
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ 
                    display: "flex", alignItems: "center", 
                    border: '1px solid #e0e0e0', borderRadius: '50px', 
                    px: 1, py: 0.5, bgcolor: isOutOfStock ? '#eee' : '#fafafa',
                    opacity: isOutOfStock ? 0.5 : 1,
                    pointerEvents: isOutOfStock ? 'none' : 'auto'
                }}>
                    <IconButton onClick={handleRemove} color="primary" size="medium" disabled={isOutOfStock || quantity <= 1}>
                        <Remove />
                    </IconButton>
                    <TextField
                        value={quantity}
                        variant="standard"
                        disabled={isOutOfStock}
                        InputProps={{ disableUnderline: true }}
                        sx={{ width: 50, textAlign: 'center', '& input': { textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' } }}
                        onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) val = 1;
                            if (val > maxQuantity) val = maxQuantity;
                            setQuantity(val);
                        }}
                    />
                    <IconButton onClick={handleAdd} color="primary" size="medium" disabled={isOutOfStock || quantity >= maxQuantity}>
                        <Add />
                    </IconButton>
                </Box>

                <Button 
                    variant="contained" 
                    size="large" 
                    startIcon={isOutOfStock ? <BlockIcon /> : <ShoppingCart />}
                    onClick={handleBuy}
                    disabled={isOutOfStock}
                    sx={{ 
                        flexGrow: 1, 
                        borderRadius: '50px', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        py: 1.5,
                        bgcolor: isOutOfStock ? '#bdbdbd !important' : 'primary.main',
                        color: isOutOfStock ? '#fff !important' : 'white'
                    }}
                >
                    {isOutOfStock ? "Нет в наличии" : "Добавить в корзину"}
                </Button>
            </Box>
            {quantity >= maxQuantity && !isOutOfStock && (
                <Typography variant="caption" color="warning.main" fontWeight="bold">
                    Вы выбрали максимально доступное количество
                </Typography>
            )}
          </Box>

          <Paper elevation={0} sx={{ bgcolor: '#f5f9ff', p: 3, borderRadius: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">Описание</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                {product.description || "Описание отсутствует."}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <RateReviewIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">Оставить отзыв</Typography>
            </Box>
            
            <Stack spacing={2}>
                <Box>
                    <Typography component="legend" variant="caption">Ваша оценка</Typography>
                    <Rating 
                        value={newRating} 
                        onChange={(e, val) => setNewRating(val)} 
                        size="large"
                    />
                </Box>
                
                <TextField
                    label="Напишите ваш комментарий..."
                    multiline
                    rows={3}
                    fullWidth
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    variant="outlined"
                />
                
                <Button 
                    variant="contained" 
                    endIcon={<SendIcon />} 
                    onClick={handleAddReview}
                    disabled={!user}
                    sx={{ alignSelf: 'flex-end', borderRadius: '20px', px: 3 }}
                >
                    {user ? "Отправить" : "Войдите, чтобы написать"}
                </Button>
            </Stack>
          </Paper>

        </Box>
      </Box>
    </Box>
  );
}