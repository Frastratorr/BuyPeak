import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";

export default function ProductCard({ id, name, description, price, image }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: 2,
        width: "70%",
        minHeight: 280,
      }}
    >
      <Box
        sx={{
          width: 1200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{
            width: "100%",
            height: 200,
            borderRadius: 2,
            objectFit: "cover",
          }}
        />

        <Button
          variant="contained"
          size="medium"
          component={Link}
          to={`/product/${id}`}
          sx={{
            width: "100%",
            paddingY: 1,
            fontSize: "1rem"
          }}
        >
          Перейти к товару
        </Button>
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: 3,
        }}
      >
        <Typography 
          variant="h5"
          sx={{ 
            fontWeight: 700, 
            textAlign: "center"
          }}
        >
          {name}
        </Typography>

        <Typography 
          variant="body1"
          sx={{ 
            textAlign: "center", 
            opacity: 0.9 
          }}
        >
          {description}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            marginTop: "auto",
            textAlign: "center",
            fontWeight: 800,
            color: "#2e7d32",
          }}
        >
          {price} $
        </Typography>
      </CardContent>
    </Card>
  );
}
