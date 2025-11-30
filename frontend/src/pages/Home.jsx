import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import catalogPreview from '../assets/img/products/catalog-preview.jpg';

export default function Home() {
  const news = [
    'Новость 1: Новая коллекция уже в продаже!',
    'Новость 2: Бесплатная доставка при заказе от 100€',
    'Новость 3: Расширение ассортимента электроники',
    'Новость 4: Скидки до 50% на популярные товары'
  ];

  const products = [
    { id: 1, name: 'Товар 1', price: '€29.99' },
    { id: 2, name: 'Товар 2', price: '€39.99' },
    { id: 3, name: 'Товар 3', price: '€19.99' },
    { id: 4, name: 'Товар 4', price: '€49.99' },
  ];

  const services = ['дрочить', 'ебать', 'шпилить', 'трахать', 'любить'];

  return (
    <div style={{ padding: '20px' }}>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* Левый блок текста */}
        <div
          style={{
            flex: 1,
            minWidth: "0",
            background: "#e3f2fd",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ margin: 0 }}>BuyPeak — Ваш лучший выбор для онлайн покупок!</h1>
          <p style={{ marginTop: '30px' }}>
            Удобно, быстро и выгодно — выбирайте товары и оформляйте заказ онлайн!
          </p>
        </div>

        {/* Блок перехода в каталог — теперь в одном ряду */}
        <div style={{ width: '600px', flexShrink: 0 }}>
          <Link
            to="/catalog"
            style={{
              display: 'block',
              background: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              textDecoration: "none",
            }}
          >
            <div style={{ height: '140px', overflow: 'hidden' }}>
              <img
                src={catalogPreview}
                alt="Каталог"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div
              style={{
                padding: '15px',
                textAlign: 'center',
                background: '#1976d2',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              Перейти к товарам
            </div>
          </Link>
        </div>
      </div>

      {/* О нас */}
      <div
        style={{
          marginTop: '30px',
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '10px',
          background: '#e3f2fd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '20px',
          height: '260px',
        }}
      >
        {/* Левый блок */}
        <div
          style={{
            flex: '0 0 40%',
            background: '#bbdefb',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2 style={{ margin: 0 }}>О нас</h2>
          <p style={{ marginTop: '20px', lineHeight: '1.5' }}>
            Bla bla bla ble ble ble blu blu blu
          </p>
        </div>

        {/* Правый блок */}
        <div
          style={{
            flex: 1,
            background: '#bbdefb',
            borderRadius: '10px',
            padding: '20px',
            overflow: 'hidden',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
            Предоставляемые услуги
          </h2>

          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            style={{ height: '165px' }}
          >
            {services.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    padding: '20px',
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    textAlign: 'center',
                    height: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '18px'
                  }}
                >
                  {item}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Новости */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center' }}>Новости</h2>
        <Swiper modules={[Navigation]} navigation={true} spaceBetween={20} slidesPerView={2} loop={true}>
          {news.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  padding: '15px',
                  background: '#e0e0e0',
                  borderRadius: '10px',
                  textAlign: 'center',
                  height: '100px'
                }}
              >
                {item}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Акции */}
      <div>
        <h2 style={{ textAlign: 'center' }}>Акции</h2>
        <Swiper modules={[Navigation]} navigation={true} spaceBetween={20} slidesPerView={3} loop={true}>
          {products.map(product => (
            <SwiperSlide key={product.id}>
              <div
                style={{
                  padding: '10px',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ height: '100px', background: '#ddd', marginBottom: '10px' }}>
                  Изображение
                </div>
                <p>{product.name}</p>
                <p style={{ fontWeight: 'bold' }}>{product.price}</p>

                <Link
                  to={`/product/${product.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    background: '#1976d2',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    display: 'inline-block'
                  }}
                >
                  Купить
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
