import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, TextField, Avatar, Rating } from "@mui/material";
import defaultAvatar from "../assets/img/default-avatar.jpg";
import { useNotification } from "../context/NotificationContext";

export default function Profile() {
  const { user: currentUser, updateUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id: userIdParam } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [allReviews, setAllReviews] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const isMyProfile = currentUser && (!userIdParam || String(userIdParam) === String(currentUser.id));

  useEffect(() => {
    if (!currentUser && !userIdParam) { navigate("/login"); return; }

    const reviews = Object.keys(localStorage)
      .filter(key => key.startsWith("reviews_"))
      .map(key => JSON.parse(localStorage.getItem(key)))
      .flat();
    setAllReviews(reviews);

    const purchases = JSON.parse(localStorage.getItem("purchase_history") || "[]");
    setPurchaseHistory(purchases);

    if (isMyProfile) {
      setProfileUser(currentUser);
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setAvatar(currentUser.avatar || defaultAvatar);
      setBio(currentUser.bio || "");
    } else {
      const userReviews = reviews.filter(r => String(r.userId) === String(userIdParam));
      if (userReviews.length > 0) {
        setProfileUser({
          id: userIdParam,
          nickname: userReviews[0].nickname || "Пользователь",
          avatar: userReviews[0].avatar || defaultAvatar,
          bio: userReviews[0].bio || ""
        });
        setName(userReviews[0].nickname || "Пользователь");
        setEmail("");
        setAvatar(userReviews[0].avatar || defaultAvatar);
        setBio(userReviews[0].bio || "");
      } else {
        setProfileUser({ id: userIdParam, nickname: "Пользователь", avatar: defaultAvatar, bio: "" });
        setName("Пользователь");
        setEmail("");
        setAvatar(defaultAvatar);
        setBio("");
      }
    }
  }, [userIdParam, currentUser, isMyProfile, navigate]);

  if (!profileUser) return null;

  const handleAvatarChange = (e) => {
    if (!isMyProfile) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!isMyProfile) return;
    const updatedUser = { ...currentUser, name, email, avatar, bio };
    updateUser(updatedUser);
    showNotification("Профиль обновлён!");
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "40px auto", borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
      <Box sx={{ height: 150, background: "linear-gradient(90deg, #1976d2, #42a5f5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>{name || "Без имени"}</Typography>
          {email && <Typography sx={{ color: "white", opacity: 0.8 }}>{email}</Typography>}
        </Box>
      </Box>

      <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Avatar src={avatar} sx={{ width: 130, height: 130, mb: 2 }} />
        {isMyProfile && <Button variant="outlined" component="label">Загрузить аватар<input type="file" hidden onChange={handleAvatarChange} /></Button>}
        {isMyProfile && (
          <>
            <TextField label="Имя" value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField label="Био" multiline rows={3} value={bio} onChange={e => setBio(e.target.value)} fullWidth />
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>Сохранить профиль</Button>
          </>
        )}
        {!isMyProfile && <Typography sx={{ opacity: 0.8, width: "100%" }}>{bio || "Пользователь пока не добавил био"}</Typography>}

        <Box sx={{ width: "100%", mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Отзывы</Typography>
          {allReviews.filter(r => String(r.userId) === String(profileUser.id)).length === 0 ? (
            <Typography>Отзывов пока нет.</Typography>
          ) : (
            allReviews
              .filter(r => String(r.userId) === String(profileUser.id))
              .map(r => (
                <Box key={r.id} sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2, background: "#f9f9f9" }}>
                  <Typography sx={{ fontWeight: 600 }}>{r.nickname || "Пользователь"}</Typography>
                  <Rating value={r.rating || 0} readOnly size="small" />
                  <Typography>{r.text}</Typography>
                  <Typography sx={{ fontSize: 12, color: "gray", textAlign: "right" }}>{new Date(r.date).toLocaleDateString()}</Typography>
                </Box>
              ))
          )}
        </Box>
      </Box>
    </Box>
  );
}