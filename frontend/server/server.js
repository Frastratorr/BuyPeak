import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// ТЕПЕРЬ ИСПОЛЬЗУЕМ ОДИН ФАЙЛ db.json
const dbFile = path.join(__dirname, "db.json");

// Создаём файл с начальной структурой, если его нет
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: [], reviews: [], cart: [] }, null, 2));
}

app.use(cors());
app.use(express.json());

// --- Вспомогательные функции для чтения/записи БД ---
const getDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch (e) {
    return { users: [], reviews: [], cart: [] };
  }
};

const saveDb = (data) => {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// ================= ПОЛЬЗОВАТЕЛИ =================

// Получить всех пользователей
app.get("/users", (req, res) => {
  const db = getDb();
  res.json(db.users);
});

// Получить ОДНОГО пользователя по ID (ЭТОГО НЕ БЫЛО, НО ЭТО НУЖНО ДЛЯ PROFILE.JSX)
app.get("/users/:id", (req, res) => {
  const db = getDb();
  // Ищем пользователя (сравниваем как строки, чтобы избежать проблем типов)
  const user = db.users.find(u => String(u.id) === String(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json(user);
});

// Регистрация
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const db = getDb();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Пользователь с таким email уже существует" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    avatar: "/images/default-avatar.jpg",
    bio: "Привет! Я новый пользователь.",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  res.json(newUser);
});

// Логин
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const foundUser = db.users.find(u => u.email === email && u.password === password);

  if (!foundUser) {
    return res.status(400).json({ error: "Неверный email или пароль" });
  }

  res.json(foundUser);
});

// Обновление профиля
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const db = getDb();
    const index = db.users.findIndex(u => String(u.id) === String(id));
    
    if (index === -1) return res.status(404).json({error: "Пользователь не найден"});

    // Обновляем данные, сохраняя ID
    const updatedUser = {...db.users[index], ...updateData, id: db.users[index].id };
    db.users[index] = updatedUser;
    
    saveDb(db);

    res.json(updatedUser);
});

// ================= ОТЗЫВЫ =================

// Получить все отзывы
app.get("/reviews", (req, res) => {
  const db = getDb();
  res.json(db.reviews);
});

// Получить отзывы для конкретного товара
app.get("/reviews/product/:id", (req, res) => {
  try {
    const db = getDb();
    const productReviews = db.reviews.filter(r => String(r.productId) === String(req.params.id));
    res.json(productReviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось загрузить отзывы" });
  }
});

// Добавить отзыв
app.post("/reviews", (req, res) => {
  try {
    const db = getDb();
    const newReview = { id: Date.now(), ...req.body };
    db.reviews.push(newReview);
    saveDb(db);
    res.json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось сохранить отзыв" });
  }
});

app.get("/cart/:userId", (req, res) => {
  const db = getDb();
  // Ищем запись, приводим ID к строке для надежности
  const userCartEntry = db.carts.find(c => String(c.userId) === String(req.params.userId));
  
  // Если нашли - отдаем товары, если нет - пустой массив
  res.json(userCartEntry ? userCartEntry.items : []);
});

// Обновить/Сохранить корзину (POST)
app.post("/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const { items } = req.body; 

  const db = getDb();
  // Ищем индекс корзины
  const cartIndex = db.carts.findIndex(c => String(c.userId) === String(userId));

  if (cartIndex !== -1) {
    // Обновляем существующую
    db.carts[cartIndex].items = items;
  } else {
    // Создаем новую
    db.carts.push({ userId, items });
  }

  saveDb(db);
  res.json({ success: true, items });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));