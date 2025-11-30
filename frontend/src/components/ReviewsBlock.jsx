import { useState } from "react";
import { Box, Typography, Avatar, Rating, IconButton } from "@mui/material";
import { ThumbUp, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/img/default-avatar.jpg";

export default function ReviewsBlock({ reviews, saveReviews, currentUser }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");

  const handleLike = (id) => {
    if (!currentUser) return;
    const updated = reviews.map(r => {
      if (r.id !== id) return r;

      const alreadyLiked = r.likeBy?.includes(currentUser.id);
      return {
        ...r,
        likeBy: alreadyLiked ? r.likeBy.filter(uid => uid !== currentUser.id) : [...(r.likeBy || []), currentUser.id],
        likes: alreadyLiked ? Math.max((r.likes || 1) - 1, 0) : (r.likes || 0) + 1
      };
    });
    saveReviews(updated);
  };

  const handleDelete = (id) => {
    saveReviews(reviews.filter(r => r.id !== id));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    return b.date - a.date;
  });

  if (reviews.length === 0) return null;

  return (
    <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Отзывы:</Typography>
      <Box sx={{ mb: 2 }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "4px 8px", borderRadius: 4 }}
        >
          <option value="date">По дате</option>
          <option value="rating">По рейтингу</option>
        </select>
      </Box>

      {sortedReviews.map(r => (
        <Box key={r.id} sx={{ display: "flex", gap: 2, border: "1px solid #ccc", borderRadius: 2, padding: 1 }}>
          <Avatar
            src={r.avatar || defaultAvatar}
            alt={r.nickname}
            sx={{ width: 40, height: 40, cursor: "pointer" }}
            onClick={() => navigate(`/profile/${r.userId}`)}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ cursor: "pointer", fontWeight: 600 }} onClick={() => navigate(`/profile/${r.userId}`)}>{r.nickname}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => handleLike(r.id)}>
                  <ThumbUp fontSize="small" color={r.likeBy?.includes(currentUser?.id) ? "primary" : "inherit"} />
                </IconButton>
                <Typography>{r.likes || 0}</Typography>
                {currentUser && r.userId === currentUser.id && (
                  <IconButton size="small" onClick={() => handleDelete(r.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Rating value={r.rating} readOnly size="small" />
            <Typography>{r.text}</Typography>
            <Typography sx={{ fontSize: 12, color: "gray" }}>
              {new Date(r.date).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
