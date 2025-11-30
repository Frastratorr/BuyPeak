import { Typography, Box } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Typography variant="h3">404 - Страница не найдена</Typography>
    </Box>
  );
}