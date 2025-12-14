import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment,
  MenuItem
} from "@mui/material";
import {
  LocalShipping,
  CreditCard,
  Person,
  Home,
  CheckCircle,
  AccountBalanceWallet,
  Public
} from "@mui/icons-material";

const countryCodes = [
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+1",   country: "USA",     flag: "🇺🇸" },
  { code: "+48",  country: "Poland",  flag: "🇵🇱" },
  { code: "+49",  country: "Germany", flag: "🇩🇪" },
  { code: "+44",  country: "UK",      flag: "🇬🇧" },
  { code: "+7",   country: "Kazakhstan", flag: "🇰🇿" },
];

export default function CheckoutPage() {
  // 🔥 ЖЕСТКАЯ ССЫЛКА НА СЕРВЕР (Чтобы убрать NetworkError)
  const API_URL = "https://buypeak.onrender.com";

  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [phoneCode, setPhoneCode] = useState("+380");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    country: "",
    address: "",
    city: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const total = cart.reduce((sum, item) => {
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    const priceNum = Number(priceStr) || 0;
    return sum + priceNum * item.quantity;
  }, 0);
  
  const deliveryCost = total > 100 ? 0 : 10;
  const finalPrice = total + deliveryCost;

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Ваша корзина пуста</Typography>
        <Button onClick={() => navigate("/catalog")} sx={{ mt: 2 }}>В каталог</Button>
      </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address || !formData.city || !formData.phone || !formData.country) {
        return showNotification("Заполните все поля адреса", "warning");
    }
    if (paymentMethod === "card" && !formData.cardNumber) {
        return showNotification("Введите данные карты", "warning");
    }

    const fullPhoneNumber = `${phoneCode} ${formData.phone}`;

    // 🔥 Очистка данных перед отправкой (Гарантируем правильные ID)
    const sanitizedItems = cart.map(item => ({
        id: item.id || item._id, // Берем любой доступный ID
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.img
    }));

    const newOrder = {
      userId: user?.id || "guest",
      items: sanitizedItems,
      total: finalPrice,
      shippingInfo: {
        country: formData.country,
        address: `${formData.city}, ${formData.address}`,
        phone: fullPhoneNumber,
        name: formData.fullName
      },
      date: Date.now()
    };

    try {
      // 🔥 Используем жесткую ссылку
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });

      const data = await res.json();

      if (!res.ok) {
          throw new Error(data.error || "Ошибка при создании заказа");
      }

      clearCart();
      showNotification("Заказ успешно оформлен!", "success");
      
      if (user && user.id) {
          navigate(`/profile/${user.id}`);
      } else {
          navigate("/");
      }

    } catch (err) {
      console.error(err);
      showNotification(`Ошибка: ${err.message}`, "error");
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>Оформление заказа</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocalShipping color="primary" />
                    <Typography variant="h6" fontWeight="bold">Адрес доставки</Typography>
                </Box>
                
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField 
                            label="ФИО Получателя" fullWidth required 
                            name="fullName" value={formData.fullName} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="Страна" fullWidth required
                            name="country"
                            value={formData.country} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Public color="action" /></InputAdornment> }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                select
                                label="Код"
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                sx={{ width: 140 }}
                                SelectProps={{
                                    renderValue: (selected) => {
                                        const country = countryCodes.find(c => c.code === selected);
                                        return `${country.flag} ${country.code}`;
                                    }
                                }}
                            >
                                {countryCodes.map((option) => (
                                    <MenuItem key={option.code} value={option.code}>
                                        <Typography variant="body2">
                                            {option.flag} ({option.code})
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField 
                                label="Номер телефона" fullWidth required 
                                name="phone" value={formData.phone} onChange={handleChange}
                                placeholder="99 123 45 67"
                                type="tel"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                label="Город" fullWidth required 
                                name="city" value={formData.city} onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Home color="action" /></InputAdornment> }}
                            />
                            <TextField 
                                label="Адрес (Улица, Дом, Кв)" fullWidth required 
                                name="address" value={formData.address} onChange={handleChange}
                            />
                        </Box>
                    </Grid>
                </Grid>
              </Paper>

              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccountBalanceWallet color="primary" />
                    <Typography variant="h6" fontWeight="bold">Способ оплаты</Typography>
                </Box>

                <FormControl component="fieldset">
                    <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <FormControlLabel value="card" control={<Radio />} label="Картой онлайн" />
                        <FormControlLabel value="cash" control={<Radio />} label="При получении" />
                    </RadioGroup>
                </FormControl>

                {paymentMethod === "card" && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard fontSize="small" /> Данные карты
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField 
                                    label="Номер карты" fullWidth placeholder="0000 0000 0000 0000"
                                    name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                    label="Срок (MM/YY)" fullWidth placeholder="12/25"
                                    name="expiry" value={formData.expiry} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                    label="CVV" fullWidth type="password" placeholder="123"
                                    name="cvv" value={formData.cvv} onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Ваш заказ</Typography>
                
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                    {cart.map(item => (
                        <Box key={item.id || item._id} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <Typography noWrap sx={{ maxWidth: '70%' }}>{item.name} x{item.quantity}</Typography>
                            <Typography fontWeight="bold">
                                {((Number(String(item.price).replace(/[^0-9.]/g, '')) || 0) * item.quantity).toFixed(2)}$
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography color="text.secondary">Товары</Typography>
                    <Typography>€{total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography color="text.secondary">Доставка</Typography>
                    <Typography color={deliveryCost === 0 ? "success.main" : "inherit"}>
                        {deliveryCost === 0 ? "Бесплатно" : `€${deliveryCost}`}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Итого</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">€{finalPrice.toFixed(2)}</Typography>
                </Box>

                <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    startIcon={<CheckCircle />}
                    sx={{ borderRadius: "10px", height: 50, fontWeight: "bold" }}
                >
                    Подтвердить заказ
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                    Нажимая кнопку, вы соглашаетесь с условиями обработки данных.
                </Typography>
            </Paper>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
}