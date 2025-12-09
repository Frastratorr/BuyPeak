import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Avatar, 
  Rating, 
  Stack, 
  Button, 
  Menu, 
  MenuItem, 
  IconButton,
  Paper
} from "@mui/material";
import { 
  Sort as SortIcon, 
  KeyboardArrowDown, 
  ThumbUpAltOutlined,
  ThumbUp,
  DeleteOutline
} from "@mui/icons-material";

export default function ReviewsBlock({ reviews, onDelete, currentUser }) {
  const [sortOption, setSortOption] = useState("newest");
  const [anchorEl, setAnchorEl] = useState(null);
  const [likedReviews, setLikedReviews] = useState({}); 
  const open = Boolean(anchorEl);

  const handleClickSort = (event) => setAnchorEl(event.currentTarget);
  const handleCloseSort = (option) => {
    if (option) setSortOption(option);
    setAnchorEl(null);
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const sortedReviews = [...safeReviews].sort((a, b) => {
    switch (sortOption) {
      case "newest": return b.date - a.date;
      case "oldest": return a.date - b.date;
      case "high": return b.rating - a.rating;
      case "low": return a.rating - b.rating;
      default: return 0;
    }
  });

  const getSortLabel = () => {
    switch (sortOption) {
      case "newest": return "Сначала новые";
      case "oldest": return "Сначала старые";
      case "high": return "С высоким рейтингом";
      case "low": return "С низким рейтингом";
      default: return "Сортировка";
    }
  };

  function stringAvatar(name) {
    const bgColors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#4caf50", "#ff9800", "#795548"];
    let hash = 0;
    const safeName = name || "Guest";
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = bgColors[Math.abs(hash) % bgColors.length];
    return { sx: { bgcolor: color } };
  }

  const handleLike = (id) => {
    setLikedReviews(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
          {safeReviews.length} {safeReviews.length === 1 ? "отзыв" : "отзыва"}
        </Typography>

        {safeReviews.length > 0 && (
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SortIcon />}
              endIcon={<KeyboardArrowDown />}
              onClick={handleClickSort}
              sx={{ 
                borderRadius: "20px", 
                textTransform: "none", 
                borderColor: "#e0e0e0", 
                color: "#555",
                fontWeight: 600,
                padding: "5px 15px",
                '&:hover': { borderColor: "#1976d2", bgcolor: "#f5f9ff", color: "#1976d2" }
              }}
            >
              {getSortLabel()}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleCloseSort(null)}
              PaperProps={{ elevation: 3, sx: { borderRadius: 3, mt: 1, minWidth: 200 } }}
            >
              <MenuItem onClick={() => handleCloseSort("newest")} selected={sortOption === "newest"}>Сначала новые</MenuItem>
              <MenuItem onClick={() => handleCloseSort("oldest")} selected={sortOption === "oldest"}>Сначала старые</MenuItem>
              <MenuItem onClick={() => handleCloseSort("high")} selected={sortOption === "high"}>С высоким рейтингом</MenuItem>
              <MenuItem onClick={() => handleCloseSort("low")} selected={sortOption === "low"}>С низким рейтингом</MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Stack spacing={2}>
        {sortedReviews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4, bgcolor: "#f9f9f9", borderRadius: 3, border: "1px dashed #e0e0e0" }}>
            <Typography variant="body2" color="text.secondary">
              Отзывов пока нет. Будьте первым!
            </Typography>
          </Box>
        ) : (
          sortedReviews.map((review) => {
            const isMyReview = currentUser && String(currentUser.id) === String(review.userId);
            const displayName = isMyReview ? currentUser.name : (review.nickname || "Пользователь");
            const displayAvatar = isMyReview ? currentUser.avatar : review.avatar;
            const isLiked = likedReviews[review.id];

            return (
              <Paper 
                  key={review.id} 
                  elevation={0}
                  sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      bgcolor: "#fff", 
                      border: "1px solid #f0f0f0",
                      transition: "0.2s",
                      '&:hover': { boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderColor: "transparent", transform: "translateY(-2px)" }
                  }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box 
                      component={Link}
                      to={`/profile/${review.userId}`}
                      sx={{ 
                          display: "flex", gap: 2, alignItems: "center", textDecoration: "none", color: "inherit", cursor: "pointer",
                          '&:hover .nickname': { color: "#1976d2", textDecoration: "underline" }
                      }}
                  >
                      {displayAvatar ? (
                          <Avatar src={displayAvatar} />
                      ) : (
                          <Avatar {...stringAvatar(displayName)}>
                              {displayName ? displayName[0].toUpperCase() : "U"}
                          </Avatar>
                      )}
                      
                      <Box>
                          <Typography variant="subtitle2" fontWeight="bold" className="nickname" sx={{ transition: "0.2s" }}>
                              {displayName}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                      </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                    </Typography>
                    
                    {isMyReview && (
                        <IconButton size="small" onClick={() => onDelete(review.id)} color="error" title="Удалить отзыв">
                            <DeleteOutline fontSize="small" />
                        </IconButton>
                    )}
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "#333", mb: 2, mt: 1 }}>
                  {review.text}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                   <IconButton 
                        size="small" 
                        onClick={() => handleLike(review.id)}
                        color={isLiked ? "primary" : "default"}
                   >
                      {isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpAltOutlined fontSize="small" />}
                   </IconButton>
                   <Typography variant="caption" color={isLiked ? "primary" : "text.secondary"} sx={{ cursor: "pointer", fontWeight: isLiked ? 'bold' : 'normal' }}>
                      {isLiked ? "Вам понравилось" : "Полезно"}
                   </Typography>
                </Box>
              </Paper>
            );
          })
        )}
      </Stack>
    </Box>
  );
}