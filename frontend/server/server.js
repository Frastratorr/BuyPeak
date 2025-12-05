import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

const dbFile = path.join(__dirname, "db.json");

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: [], reviews: [], cart: [], orders: [], products: [] }, null, 2));
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const getDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch (e) {
    return { users: [], reviews: [], cart: [], orders: [], products: [] };
  }
};

const saveDb = (data) => {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

const enrichReviewsWithUserData = (reviews, users) => {
  return reviews.map(review => {
    const author = users.find(u => String(u.id) === String(review.userId));

    if (author) {
      return {
        ...review,
        avatar: author.avatar || review.avatar,
        nickname: author.name || review.nickname 
      };
    }
    return review;
  });
};

app.get("/users", (req, res) => {
  const db = getDb();
  res.json(db.users);
});

app.get("/users/:id", (req, res) => {
  const db = getDb();
  const user = db.users.find(u => String(u.id) === String(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json(user);
});

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
    role: "user",
    isBlocked: false,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  res.json(newUser);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const foundUser = db.users.find(u => u.email === email && u.password === password);

  if (!foundUser) {
    return res.status(400).json({ error: "Неверный email или пароль" });
  }

  if (foundUser.isBlocked) {
    return res.status(403).json({ error: "Ваш аккаунт заблокирован администратором" });
  }

  res.json(foundUser);
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const db = getDb();
    const index = db.users.findIndex(u => String(u.id) === String(id));
    
    if (index === -1) return res.status(404).json({error: "Пользователь не найден"});

    const updatedUser = {...db.users[index], ...updateData, id: db.users[index].id };
    db.users[index] = updatedUser;
    
    saveDb(db);

    res.json(updatedUser);
});

app.get("/reviews", (req, res) => {
  const db = getDb();
  const updatedReviews = enrichReviewsWithUserData(db.reviews, db.users);
  res.json(updatedReviews);
});

app.get("/reviews/product/:id", (req, res) => {
  try {
    const db = getDb();
    const productReviews = db.reviews.filter(r => String(r.productId) === String(req.params.id));
    const updatedProductReviews = enrichReviewsWithUserData(productReviews, db.users);
    res.json(updatedProductReviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось загрузить отзывы" });
  }
});

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
  const userCartEntry = db.carts.find(c => String(c.userId) === String(req.params.userId));
  
  res.json(userCartEntry ? userCartEntry.items : []);
});

app.post("/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const { items } = req.body; 

  const db = getDb();
  const cartIndex = db.carts.findIndex(c => String(c.userId) === String(userId));

  if (cartIndex !== -1) {
    db.carts[cartIndex].items = items;
  } else {
    db.carts.push({ userId, items });
  }

  saveDb(db);
  res.json({ success: true, items });
});

app.get("/orders/:userId", (req, res) => {
  const db = getDb();
  const orders = db.orders || [];
  const userOrders = orders.filter(o => String(o.userId) === String(req.params.userId));
  res.json(userOrders);
});

app.post("/orders", (req, res) => {
  const db = getDb();
  const { userId, items, total, shippingInfo, date } = req.body;

  if (!db.orders) {
      db.orders = [];
  }

  for (const item of items) {
    const productIndex = db.products.findIndex(p => String(p.id) === String(item.id));
    if (productIndex !== -1) {
      const currentQty = db.products[productIndex].quantity || 0;
      if (currentQty < item.quantity) {
        return res.status(404).json({ error: `Товара "${item.name}" осталось всего ${currentQty} шт.` });
      }

      db.products[productIndex].quantity -= item.quantity;
    }
  }

  const newOrder = {
    id: Date.now(),
    userId,
    items,
    total,
    shippingInfo,
    date: date || Date.now(),
    status: "processing"
  };

  db.orders.push(newOrder);
  
  const cartIndex = db.carts.findIndex(c => String(c.userId) === String(userId));
  if (cartIndex !== -1) {
    db.carts[cartIndex].items = [];
  }

  saveDb(db);
  res.json(newOrder);
});

app.get("/products", (req, res) => {
  const db = getDb();
  res.json(db.products || []);
});

app.post("/products", (req, res) => {
  const db = getDb();
  const newProduct = {
    id: Date.now(),
    ...req.body
  };
  if (!db.products) db.products = [];
  db.products.push(newProduct);
  saveDb(db);
  res.json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const db = getDb();
  const index = db.products.findIndex(p => String(p.id) === String(req.params.id));
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...req.body };
    saveDb(db);
    res.json(db.products[index]);
  } else {
    res.status(404).json({ error: "Товар не найден" });
  }
});

app.delete("/products/:id", (req, res) => {
  const db = getDb();
  if (db.products) {
    db.products = db.products.filter(p => String(p.id) !== String(req.params.id));
    saveDb(db);
  }
  res.json({ success: true });
});

app.get("/admin/orders", (req, res) => {
  const db = getDb();
  res.json(db.orders || []);
});

app.put("/admin/orders/:id", (req, res) => {
  const db = getDb();
  const index = db.orders.findIndex(o => String(o.id) === String(req.params.id));
  if (index !== -1) {
    db.orders[index].status = req.body.status;
    saveDb(db);
    res.json(db.orders[index]); 
  } else {
    res.status(404).json({ error: "Заказ не найден" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));