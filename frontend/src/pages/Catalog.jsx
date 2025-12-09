import { useState, useEffect } from "react";
import ProductCard from '../components/ProductCard';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  Divider, 
  CircularProgress,
  Container
} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minQuantity && p.quantity < Number(minQuantity)) return false;
    if (maxQuantity && p.quantity > Number(maxQuantity)) return false;
    return true;
  });

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f8fbff'
    }}>
        <CircularProgress size={60} thickness={4} />
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)",
      pb: 8,
      pt: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column-reverse", md: "row" }, alignItems: "flex-start" }}>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" sx={{ 
              mb: 4, 
              fontWeight: 800, 
              color: "#1a237e",
              textShadow: "0px 2px 4px rgba(0,0,0,0.05)"
            }}>
              Каталог
            </Typography>

            {filteredProducts.length === 0 ? (
               <Box sx={{ 
                 textAlign: 'center', 
                 mt: 5, 
                 p: 6,
                 background: "rgba(255, 255, 255, 0.5)",
                 backdropFilter: "blur(10px)",
                 borderRadius: "24px",
                 border: "1px solid rgba(255, 255, 255, 0.6)"
               }}>
                 <Typography variant="h5" fontWeight="bold" color="text.secondary">Товары не найдены 😔</Typography>
                 <Typography variant="body1" color="text.secondary" mt={1}>Попробуйте изменить параметры фильтров</Typography>
               </Box>
            ) : (
              <Stack spacing={3}>
                {filteredProducts.map((product, index) => (
                  <Box key={product._id || product.id || index} sx={{ width: '100%' }}>
                    <ProductCard {...product} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Box sx={{ 
              width: { xs: "100%", md: "340px" }, 
              flexShrink: 0,
              position: { md: "sticky" },
              top: "100px",
              zIndex: 10 
          }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
                maxHeight: "85vh",
                overflowY: "auto"
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: "12px", background: "#e3f2fd" }}>
                  <FilterAltIcon color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="#333">Фильтры</Typography>
              </Box>
              
              <Divider sx={{ mb: 3, borderColor: "#eee" }} />

              <Stack spacing={4}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: "#555" }}>
                    <AttachMoneyIcon fontSize="small" /> Цена
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="От"
                      type="number"
                      size="small"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                    <TextField
                      label="До"
                      type="number"
                      size="small"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: "#555" }}>
                    <InventoryIcon fontSize="small" /> Наличие
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="От"
                      type="number"
                      size="small"
                      value={minQuantity}
                      onChange={e => setMinQuantity(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                    <TextField
                      label="До"
                      type="number"
                      size="small"
                      value={maxQuantity}
                      onChange={e => setMaxQuantity(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<RestartAltIcon />}
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setMaxQuantity("");
                    setMinQuantity("");
                  }}
                  sx={{ 
                    mt: 1, 
                    borderRadius: "16px", 
                    textTransform: "none", 
                    fontWeight: "bold",
                    py: 1.5,
                    boxShadow: "0 6px 20px rgba(33, 150, 243, 0.2)"
                  }}
                >
                  Сбросить
                </Button>
              </Stack>
            </Paper>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}