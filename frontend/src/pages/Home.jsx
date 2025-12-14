import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Box, Typography, Button, Card, CardContent, CardMedia, Rating } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useEffect, useState } from 'react';

export default function Home() {
  // 🔥 ЖЕСТКАЯ ССЫЛКА
  const API_URL = "https://buypeak.onrender.com";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setProducts(data);
      }
    })
    .catch(console.error);
  }, [])

  const catalogPreview = "https://res.cloudinary.com/dg2pcfylr/image/upload/v1765308207/catalog-preview_e3l46g.jpg"
  // ... (весь остальной код новостей, сервисов и слайдера оставляем как есть, он не менялся) ...
  // Вставь сюда остальной код компонента Home, который у тебя был
  // (новости, сервисы, return...)
  // Я не копирую его весь, чтобы не забивать чат, просто замени начало файла.
  
  // (ВЕРНИ СЮДА КОД РЕНДЕРА, КОТОРЫЙ У ТЕБЯ УЖЕ ЕСТЬ, ОН НОРМАЛЬНЫЙ)
  const news = [ /*...*/ ];
  const services = [ /*...*/ ];
  const swiperStyles = { /*...*/ };

  return (
     <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
        {/* ... твой JSX код ... */}
        {/* В блоке "Горячие предложения" убедись, что мапишь products из стейта */}
        <Box>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>Горячие предложения 🔥</Typography>
        <Box sx={swiperStyles}>
            <Swiper modules={[Navigation]} navigation={true} spaceBetween={25} slidesPerView={1} breakpoints={{ 500: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1100: { slidesPerView: 4 } }} loop={products.length > 4} style={{ padding: '10px' }}>
            {products.map(product => {
                const oldPrice = (product.price * 1.2).toFixed(2);
                return (
                    <SwiperSlide key={product.id}>
                    <Card sx={{ borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ position: 'relative', pt: 2, px: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220, bgcolor: 'white', borderRadius: '16px 16px 0 0' }}>
                            <CardMedia component="img" image={product.image} alt={product.name} sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                            <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: '#ff1744', color: 'white', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)' }}>SALE</Box>
                        </Box>
                        <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.6)' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 1, height: '40px', overflow: 'hidden', lineHeight: 1.2 }}>{product.name}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}><Rating value={4.5} precision={0.5} readOnly size="small" /></Box>
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography variant="h6" color="primary" fontWeight="bold">${product.price}</Typography>
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>${oldPrice}</Typography>
                                </Box>
                                <Button component={Link} to={`/product/${product.id}`} variant="contained" fullWidth startIcon={<AddShoppingCartIcon />} sx={{ borderRadius: '12px' }}>Купить</Button>
                            </Box>
                        </CardContent>
                    </Card>
                    </SwiperSlide>
                );
            })}
            </Swiper>
        </Box>
      </Box>
     </Box>
  );
}