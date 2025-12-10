import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
const DEFAULT_AVATAR = "https://res.cloudinary.com/dg2pcfylr/image/upload/v1765308214/default-avatar_e3ep28.jpg";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const User = mongoose.model('User', new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed,
  name: String,
  email: String,
  password: String,
  avatar: { type: String, default: DEFAULT_AVATAR },
  bio: String,
  role: { type: String, default: "user" },
  isBlocked: { type: Boolean, default: false },
  createdAt: String
}, { strict: false }));

const Product = mongoose.model('Product', new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed, 
  name: String,
  price: Number,
  image: String,
  description: String,
  quantity: Number
}, { strict: false }));

const Review = mongoose.model('Review', new mongoose.Schema({
  id: Number,
  text: String,
  rating: Number,
  userId: mongoose.Schema.Types.Mixed,
  productId: mongoose.Schema.Types.Mixed,
  date: Number
}, { strict: false }));

const Order = mongoose.model('Order', new mongoose.Schema({
  id: Number,
  userId: mongoose.Schema.Types.Mixed,
  items: Array,
  total: Number,
  shippingInfo: Object,
  date: Number,
  status: String
}, { strict: false }));

const Cart = mongoose.model('Cart', new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
  items: Array
}, { strict: false }));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'BuyPeak API v3',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: 'not connected',
    server: 'running',
    uptime: process.uptime()
  });
});

app.get('/products', (req, res) => {
  const mockProducts = [
    { id: 1, name: "iPhone 15", price: 999, quantity: 10, image: "https://via.placeholder.com/300" },
    { id: 2, name: "MacBook Pro", price: 1999, quantity: 5, image: "https://via.placeholder.com/300" },
    { id: 3, name: "AirPods Pro", price: 249, quantity: 20, image: "https://via.placeholder.com/300" }
  ];
  res.json(mockProducts);
});

app.get('/test', (req, res) => {
  res.json({ 
    test: 'success',
    env: {
      port: PORT,
      node_env: process.env.NODE_ENV,
      has_mongo_uri: !!process.env.MONGO_URI
    }
  });
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (!isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) });
    }
    
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/products", async (req, res) => {
  const prodData = { id: Date.now(), ...req.body };
  const newProduct = new Product(prodData);
  await newProduct.save();
  res.json(newProduct);
});

app.put("/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let product = null;
      
      if (!isNaN(Number(id))) {
          product = await Product.findOneAndUpdate({ id: Number(id) }, req.body, { new: true });
      }
      
      if (!product && mongoose.Types.ObjectId.isValid(id)) {
          product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      }
      
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: "Update failed" });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let result = null;

        if (!isNaN(Number(id))) {
            result = await Product.findOneAndDelete({ id: Number(id) });
        }
        if (!result && mongoose.Types.ObjectId.isValid(id)) {
            result = await Product.findByIdAndDelete(id);
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Error fetching users" });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findOne({ id: id }); 
        if (!user && !isNaN(Number(id))) user = await User.findOne({ id: Number(id) });
        if (!user && mongoose.Types.ObjectId.isValid(id)) user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "Not found" });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/users", async (req, res) => {
    const newUser = new User({ id: Date.now().toString(), ...req.body });
    await newUser.save();
    res.json(newUser);
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findOneAndUpdate({ id: id }, req.body, { new: true });
        if (!user && !isNaN(Number(id))) user = await User.findOneAndUpdate({ id: Number(id) }, req.body, { new: true });
        if (!user && mongoose.Types.ObjectId.isValid(id)) user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(user);
    } catch(e) {
        res.status(500).json({ error: "Update failed" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    res.json(user);
});

app.get("/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching orders" });
    }
});

app.put("/admin/orders/:id", async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ id: Number(req.params.id) }, { status: req.body.status }, { new: true });
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: "Update failed" });
    }
});

app.get("/orders/:userId", async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

app.post("/orders", async (req, res) => {
    try {
        const { userId, items, total, shippingInfo } = req.body;
        
        for (const item of items) {
            let filter = null;

            if (item.id && !isNaN(Number(item.id))) {
                filter = { id: Number(item.id) };
            } else if (mongoose.Types.ObjectId.isValid(item.id)) {
                filter = { _id: item.id };
            }

            if (filter) {
                await Product.findOneAndUpdate(filter, { $inc: { quantity: -item.quantity } });
            }
        }

        const order = new Order({ 
            id: Date.now(), 
            userId, 
            items, 
            total, 
            shippingInfo, 
            status: "processing", 
            date: Date.now() 
        });
        
        await order.save();
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        
        res.json(order);
    } catch (err) {
        console.error("Order error:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

app.get("/reviews", async (req, res) => {
    const reviews = await Review.find();
    const users = await User.find();
    const enriched = reviews.map(r => {
        const author = users.find(u => String(u.id) === String(r.userId) || String(u._id) === String(r.userId));
        return { ...r.toObject(), avatar: author ? (author.avatar || DEFAULT_AVATAR) : DEFAULT_AVATAR, nickname: author ? author.name : "Гость" };
    });
    res.json(enriched);
});

app.get("/reviews/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ $or: [{ productId: Number(id) }, { productId: String(id) }] });
        const users = await User.find();
        const enriched = reviews.map(r => {
            const author = users.find(u => String(u.id) === String(r.userId) || String(u._id) === String(r.userId));
            return { ...r.toObject(), avatar: author ? (author.avatar || DEFAULT_AVATAR) : DEFAULT_AVATAR, nickname: author ? author.name : "Гость" };
        });
        res.json(enriched);
    } catch (err) { res.json([]); }
});

app.post("/reviews", async (req, res) => {
    try {
        const newReview = new Review({ id: Date.now(), ...req.body });
        await newReview.save();
        let author = await User.findOne({ id: newReview.userId });
        if (!author && mongoose.Types.ObjectId.isValid(newReview.userId)) author = await User.findById(newReview.userId);
        res.json({ ...newReview.toObject(), avatar: author ? (author.avatar || DEFAULT_AVATAR) : DEFAULT_AVATAR, nickname: author?.name || "Гость" });
    } catch (err) { res.status(500).json({ error: "Error saving review" }); }
});

app.delete("/reviews/:id", async (req, res) => {
    await Review.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ success: true });
});

app.get("/cart/:userId", async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
});

app.post("/cart/:userId", async (req, res) => {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) { cart.items = items; await cart.save(); }
    else { await new Cart({ userId: req.params.userId, items }).save(); }
    res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Test URL: https://buypeak.onrender.com/`);
  console.log(`📊 Health check: https://buypeak.onrender.com/health`);
  console.log(`Server running on http://localhost:${PORT}`)
});