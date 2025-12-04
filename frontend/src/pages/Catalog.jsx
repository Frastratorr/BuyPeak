import { useState } from "react";
import ProductCard from '../components/ProductCard';
import { productsData } from "../data/products";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  Divider 
} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Catalog() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");

  const products = productsData.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minQuantity && p.quantity < Number(minQuantity)) return false;
    if (maxQuantity && p.quantity > Number(maxQuantity)) return false;
    return true;
  });

  return (
    <Box sx={{ display: "flex", p: 4, gap: 4, maxWidth: "1400px", mx: "auto", minHeight: "100vh", bgcolor: "#f9f9f9", alignItems: "flex-start" }}>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
          Каталог товаров
        </Typography>

        {products.length === 0 ? (
           <Box sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
             <Typography variant="h6">Товары не найдены 😔</Typography>
             <Typography variant="body2">Попробуйте изменить параметры фильтров</Typography>
           </Box>
        ) : (
          <Stack spacing={3}>
            {products.map(product => (
              <Box key={product.id} sx={{ width: '100%' }}>
                <ProductCard {...product} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ width: "300px", flexShrink: 0 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "white",
            position: "sticky",
            top: "100px", 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterAltIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">Фильтры</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AttachMoneyIcon fontSize="small" color="action" /> Цена
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="От"
                  type="number"
                  size="small"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="До"
                  type="number"
                  size="small"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <InventoryIcon fontSize="small" color="action" /> Наличие
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="От"
                  type="number"
                  size="small"
                  value={minQuantity}
                  onChange={e => setMinQuantity(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="До"
                  type="number"
                  size="small"
                  value={maxQuantity}
                  onChange={e => setMaxQuantity(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setMaxQuantity("");
                setMinQuantity("");
              }}
              sx={{ 
                mt: 2, 
                borderRadius: "10px", 
                textTransform: "none", 
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)"
              }}
            >
              Сбросить фильтры
            </Button>
          </Stack>
        </Paper>
      </Box>

    </Box>
  );
}