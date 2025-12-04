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
import catalogPreview from '../assets/img/products/catalog-preview.jpg';

export default function Home() {
  const news = [
    { title: 'Новая коллекция!', date: '01.12', desc: 'Уже в продаже во всех категориях.' },
    { title: 'Бесплатная доставка', date: '30.11', desc: 'При заказе от 100€ по всей Европе.' },
    { title: 'Расширение электроники', date: '28.11', desc: 'Новые бренды ноутбуков и смартфонов.' },
    { title: 'Черная пятница', date: '25.11', desc: 'Скидки до 50% на хиты продаж.' },
    { title: 'Открытие шоурума', date: '20.11', desc: 'Ждем вас в центре города.' },
    { title: 'Подарочные карты', date: '15.11', desc: 'Лучший подарок для близких.' }
  ];

  const products = [
    { id: 1, name: 'Smart Watch X', price: '€29.99', oldPrice: '€45.00', img: 'https://placehold.co/200x200/png?text=Watch' },
    { id: 2, name: 'Наушники Pro', price: '€39.99', oldPrice: '€59.00', img: 'https://placehold.co/200x200/png?text=Headphones' },
    { id: 3, name: 'Чехол Leather', price: '€19.99', oldPrice: null, img: 'https://placehold.co/200x200/png?text=Case' },
    { id: 4, name: 'PowerBank 20k', price: '€49.99', oldPrice: '€65.00', img: 'https://placehold.co/200x200/png?text=PowerBank' },
    { id: 5, name: 'Smart Watch Y', price: '€35.00', oldPrice: null, img: 'https://placehold.co/200x200/png?text=Watch+2' },
    { id: 6, name: 'Колонка Bass', price: '€55.00', oldPrice: '€80.00', img: 'https://placehold.co/200x200/png?text=Speaker' },
  ];

  const services = [
    { text: 'Быстрая доставка', icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2' }} /> },
    { text: 'Гарантия качества', icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#1976d2' }} /> },
    { text: 'Поддержка 24/7', icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#1976d2' }} /> },
    { text: 'Бонусная система', icon: <CardGiftcardIcon sx={{ fontSize: 40, color: '#1976d2' }} /> },
  ];

  const swiperStyles = {
    '& .swiper-button-next, & .swiper-button-prev': {
      backgroundColor: 'white',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      color: '#1976d2',
      
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
      transition: 'all 0.3s ease',
      
      '&::after': {
        fontSize: '12px',
        fontWeight: 'bold',
      },
      
      '&:hover': {
        backgroundColor: '#1976d2',
        color: 'white',
        transform: 'scale(1.1)',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
      }
    },
    '& .swiper-button-disabled': {
        opacity: 0,
        pointerEvents: 'none'
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>

      <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: "100%", mb: 5 }}>
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: '1px solid #e3f2fd'
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#0d47a1', mb: 2 }}>
            BuyPeak
          </Typography>
          <Typography variant="h5" sx={{ color: '#555', mb: 3 }}>
            Ваш лучший выбор для онлайн покупок.
          </Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '400px' }, flexShrink: 0 }}>
          <Link to="/catalog" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: "0 15px 35px rgba(25, 118, 210, 0.2)" }
              }}
            >
              <Box sx={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={catalogPreview} alt="Каталог" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Typography sx={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontWeight: 'bold', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Новинки сезона
                </Typography>
              </Box>
              <Box sx={{ padding: '20px', background: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Перейти к товарам</Typography>
                <ArrowForwardIcon />
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>

      <Box sx={{ mb: 6, padding: '30px', borderRadius: '16px', background: '#f5f9ff', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>О нас</Typography>
          <Typography sx={{ color: '#555', lineHeight: 1.7 }}>
            BuyPeak — это комфортный шопинг и проверенные бренды.
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0, ...swiperStyles }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={true}
            autoplay={{ delay: 3000 }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
            loop={true}
            style={{ padding: '10px 5px' }}
          >
            {services.map((item, index) => (
              <SwiperSlide key={index}>
                <Card sx={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: '50%' }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>{item.text}</Typography>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Новости</Typography>
        
        <Box sx={swiperStyles}>
            <Swiper 
                modules={[Navigation]} 
                navigation={true} 
                spaceBetween={20} 
                slidesPerView={1} 
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
                loop={true}
                style={{ padding: '10px' }}
            >
            {news.map((item, index) => (
                <SwiperSlide key={index}>
                <Card sx={{ height: '100%', borderRadius: '12px', bgcolor: '#333', color: 'white' }}>
                    <CardContent>
                    <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 'bold' }}>{item.date}</Typography>
                    <Typography variant="h6" sx={{ my: 1, lineHeight: 1.2 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{item.desc}</Typography>
                    </CardContent>
                </Card>
                </SwiperSlide>
            ))}
            </Swiper>
        </Box>
      </Box>

      <Box>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>Горячие предложения 🔥</Typography>
        
        <Box sx={swiperStyles}>
            <Swiper 
                modules={[Navigation]} 
                navigation={true} 
                spaceBetween={25} 
                slidesPerView={1} 
                breakpoints={{ 500: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1100: { slidesPerView: 4 } }}
                loop={true}
                style={{ padding: '10px' }}
            >
            {products.map(product => (
                <SwiperSlide key={product.id}>
                <Card sx={{ borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia component="img" height="180" image={product.img} alt={product.name} sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }} />
                        {product.oldPrice && <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: '#ff1744', color: 'white', px: 1, borderRadius: 1, fontSize: '12px', fontWeight: 'bold' }}>SALE</Box>}
                    </Box>
                    <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 1 }}>{product.name}</Typography>
                    <Rating value={4.5} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" color="primary">{product.price}</Typography>
                        {product.oldPrice && <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'gray' }}>{product.oldPrice}</Typography>}
                    </Box>
                    <Button component={Link} to={`/product/${product.id}`} variant="contained" fullWidth startIcon={<AddShoppingCartIcon />} sx={{ borderRadius: '8px' }}>
                        Купить
                    </Button>
                    </CardContent>
                </Card>
                </SwiperSlide>
            ))}
            </Swiper>
        </Box>
      </Box>
    </Box>
  );
}