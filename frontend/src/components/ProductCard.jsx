import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const navigate = useNavigate();
  
  const validId = props.id || props._id;

  const handleClick = () => {
    if (validId) {
      navigate(`/product/${validId}`);
    } else {
      alert("Ошибка: у товара нет ID");
    }
  };

  return (
    <Card sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" }, 
        p: 2.5, 
        borderRadius: "32px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": { 
            transform: "translateY(-5px)", 
            boxShadow: "0 20px 40px rgba(33, 150, 243, 0.15)" 
        }
    }}>
      <CardMedia
        component="img"
        image={props.image || "/placeholder.png"}
        alt={props.name}
        sx={{ 
            width: { xs: "100%", sm: 220 }, 
            height: 220, 
            objectFit: "cover", 
            borderRadius: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            bgcolor: "white"
        }}
      />
      
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", pl: { sm: 4 } }}>
        <Box>
            <Typography variant="h5" fontWeight="800" gutterBottom sx={{ color: "#333" }}>
            {props.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6, height: '3.2em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {props.description}
            </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Typography variant="h4" fontWeight="900" sx={{ 
                background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }}>
            ${props.price}
            </Typography>
            
            <Button 
                variant="contained" 
                onClick={handleClick}
                sx={{
                    borderRadius: "16px",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 4,
                    py: 1,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 4px 15px rgba(33, 203, 243, 0.4)"
                }}
            >
                Подробнее
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
}