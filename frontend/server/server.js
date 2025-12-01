import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Путь к файлу пользователей
const usersFile = path.join(__dirname, "users.json");
const reviewsFile = path.join(process.cwd(), "reviews.json");

// Создаём файл, если его нет
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

if (!fs.existsSync(reviewsFile)) {
  fs.writeFileSync(reviewsFile, JSON.stringify([]));
}

app.use(cors());
app.use(express.json());

// Получить всех пользователей
app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersFile));
  res.json(users);
});

// Регистрация
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Пользователь с таким email уже существует" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    avatar: "/images/default-avatar.jpg",
    bio: "Привет! Я новый пользователь."
  };

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json(newUser);
});

// Логин
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));
  const foundUser = users.find(u => u.email === email && u.password === password);

  if (!foundUser) {
    return res.status(400).json({ error: "Неверный email или пароль" });
  }

  res.json(foundUser);
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const users = JSON.parse(fs.readFileSync(usersFile));
    const index = users.findIndex(u => u.id === +id);
    if (index === -1) return res.status(404).json({error: "Пользовательне найден"});

    const updatedUser = {...users[index], ...updateData };
    users[index] = updatedUser;
    fs.writeFileSync(usersFile, JSON.stringify(users , null, 2));

    res.json(updatedUser);
});

app.get("/reviews", (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile));
  res.json(reviews);
});

app.get("/reviews/product/:id", (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(reviewsFile));
    const productReviews = reviews.filter(r => r.productId === Number(req.params.id));
    res.json(productReviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось загрузить отзывы" });
  }
});

app.post("/reviews", (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(reviewsFile));
    const newReview = { id: Date.now(), ...req.body };
    reviews.push(newReview);
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    res.json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось сохранить отзыв" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
