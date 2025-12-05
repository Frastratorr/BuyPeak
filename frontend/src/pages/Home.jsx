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
import { productsData } from '../data/products';

export default function Home() {
  const news = [
    { title: 'Новая коллекция!', date: '01.12', desc: 'Уже в продаже во всех категориях. Успейте купить новинки сезона по старым ценам.' },
    { title: 'Бесплатная доставка', date: '30.11', desc: 'При заказе от 100€ по всей Европе доставка осуществляется за наш счет.' },
    { title: 'Расширение электроники', date: '28.11', desc: 'Новые бренды ноутбуков и смартфонов уже доступны в каталоге.' },
    { title: 'Черная пятница', date: '25.11', desc: 'Скидки до 50% на хиты продаж. Акция действует до конца недели.' },
    { title: 'Открытие шоурума', date: '20.11', desc: 'Ждем вас в центре города. Приходите протестировать технику лично.' },
    { title: 'Подарочные карты', date: '15.11', desc: 'Лучший подарок для близких — свобода выбора с нашими сертификатами.' }
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
    },
    '& .swiper-wrapper': {
        alignItems: 'stretch'
    },
    '& .swiper-slide': {
        height: 'auto'
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>

      <Box className="fade-in" sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: "100%", mb: 5 }}>
        <Box
          className="glass"
          sx={{
            flex: 1,
            padding: "40px",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#2563eb', mb: 2 }}>
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
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: "0 15px 35px rgba(37, 99, 235, 0.2)" }
              }}
            >
              <Box sx={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={catalogPreview} alt="Каталог" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Typography sx={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontWeight: 'bold', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Новинки сезона
                </Typography>
              </Box>
              <Box sx={{ padding: '20px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>Перейти к товарам</Typography>
                <ArrowForwardIcon />
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>

      <Box className="glass" sx={{ mb: 6, padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>О нас</Typography>
          <Typography sx={{ color: '#555', lineHeight: 1.7 }}>
            BuyPeak — это комфортный шопинг и проверенные бренды. Мы заботимся о каждом клиенте.
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
                <Card sx={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: 'none' }}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', color: '#2563eb' }}>{item.icon}</Box>
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
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                loop={true}
                style={{ padding: '10px' }}
            >
            {news.map((item, index) => (
                <SwiperSlide key={index} style={{ height: 'auto' }}>
                <Card sx={{ 
                    height: '100%', 
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                    border: 'none'
                }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ my: 1, lineHeight: 1.2, fontWeight: 'bold' }}>{item.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 1 }}>{item.desc}</Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', display: 'block', textAlign: 'right', opacity: 0.8 }}>
                            {item.date}
                        </Typography>
                    </Box>
                </Card>
                </SwiperSlide>
            ))}
            </Swiper>
        </Box>
      </Box>

      <Box>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>Горячие предложения 🔥</Typography>
        
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
            {productsData.map(product => {
                const oldPrice = (product.price * 1.2).toFixed(2);
                
                return (
                    <SwiperSlide key={product.id}>
                    <Card sx={{ borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ position: 'relative', pt: 2, px: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220, bgcolor: 'white', borderRadius: '16px 16px 0 0' }}>
                            <CardMedia 
                                component="img" 
                                image={product.image} 
                                alt={product.name} 
                                sx={{ 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }} 
                            />
                            <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: '#ff1744', color: 'white', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)' }}>SALE</Box>
                        </Box>
                        <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.6)' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 1, height: '40px', overflow: 'hidden', lineHeight: 1.2 }}>
                                    {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    <Rating value={4.5} precision={0.5} readOnly size="small" />
                                </Box>
                            </Box>
                            
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography variant="h6" color="primary" fontWeight="bold">${product.price}</Typography>
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>${oldPrice}</Typography>
                                </Box>
                                <Button component={Link} to={`/product/${product.id}`} variant="contained" fullWidth startIcon={<AddShoppingCartIcon />} sx={{ borderRadius: '12px' }}>
                                    Купить
                                </Button>
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