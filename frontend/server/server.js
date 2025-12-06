import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));

const User = mongoose.model('User', new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  role: { type: String, default: "user" },
  isBlocked: { type: Boolean, default: false },
  createdAt: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
  description: String,
  quantity: Number
}));

const Review = mongoose.model('Review', new mongoose.Schema({
  id: Number,
  text: String,
  rating: Number,
  userId: String,
  productId: Number,
  date: Number
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  id: Number,
  userId: String,
  items: Array,
  total: Number,
  shippingInfo: Object,
  date: Number,
  status: String
}));

const Cart = mongoose.model('Cart', new mongoose.Schema({
  userId: String,
  items: Array
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const newProduct = new Product({ id: Date.now(), ...req.body });
  await newProduct.save();
  res.json(newProduct);
});

app.put("/products/:id", async (req, res) => {
  const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
});

app.post("/users", async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.status(400).json({ error: "Пользователь уже существует" });
  }

  const newUser = new User({
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  });
  
  await newUser.save();
  res.json(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(400).json({ error: "Неверный логин или пароль" });
  }
  if (user.isBlocked) {
    return res.status(403).json({ error: "Вы были заблокированы" });
  }
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(user);
});

app.get("/reviews", async (req, res) => {
  const reviews = await Review.find();
  const users = await User.find();
  
  const enriched = reviews.map(r => {
      const author = users.find(u => u.id === r.userId);
      return author ? { ...r._doc, avatar: author.avatar, nickname: author.name } : r;
  });
  
  res.json(enriched);
});

app.get("/reviews/product/:id", async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id });
  const users = await User.find();
  
  const enriched = reviews.map(r => {
      const author = users.find(u => u.id === r.userId);
      return author ? { ...r._doc, avatar: author.avatar, nickname: author.name } : r;
  });
  
  res.json(enriched);
});

app.post("/reviews", async (req, res) => {
  const newReview = new Review({ id: Date.now(), ...req.body });
  await newReview.save();
  res.json(newReview);
});

app.get("/cart/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart ? cart.items : []);
});

app.post("/cart/:userId", async (req, res) => {
  const { items } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });
  
  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = new Cart({ userId: req.params.userId, items });
    await cart.save();
  }
  res.json({ success: true, items });
});

app.get("/orders/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

app.get("/admin/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.put("/admin/orders/:id", async (req, res) => {
  const order = await Order.findOneAndUpdate({ id: req.params.id }, { status: req.body.status }, { new: true });
  res.json(order);
});

app.post("/orders", async (req, res) => {
  const { userId, items, total, shippingInfo, date } = req.body;

  for (const item of items) {
    const product = await Product.findOne({ id: item.id });
    if (product) {
        if (product.quantity < item.quantity) {
            return res.status(400).json({ error: `Товара "${item.name}" не хватает на складе` });
        }
        product.quantity -= item.quantity;
        await product.save();
    }
  }

  const newOrder = new Order({
    id: Date.now(),
    userId,
    items,
    total,
    shippingInfo,
    date: date || Date.now(),
    status: "processing"
  });

  await newOrder.save();

  await Cart.findOneAndUpdate({ userId }, { items: [] });

  res.json(newOrder);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));