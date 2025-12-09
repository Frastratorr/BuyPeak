import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    id: 1,
    name: "Товар 1",
    price: 100,
    image: "/src/assets/img/products/product1.jpg", 
    description: "Описание первого товара",
    quantity: 10
  },
  {
    id: 2,
    name: "Товар 2",
    price: 200,
    image: "/src/assets/img/products/product2.jpg", 
    description: "Описание второго товара",
    quantity: 20
  },
  {
    id: 3,
    name: "Товар 3",
    price: 300,
    image: "/src/assets/img/products/product3.jpg",
    description: "Описание третьего товара",
    quantity: 50
  },
  {
    id: 4,
    name: "Крутой товар",
    price: 1500,
    image: "/src/assets/img/products/product4.jpg",
    description: "Эксклюзивный товар",
    quantity: 5
  },
  {
    id: 5,
    name: "Новый товар",
    price: 500,
    image: "/src/assets/img/products/product5.jpg",
    description: "Только поступил",
    quantity: 100
  }
];

console.log("🌱 ЗАПУСК СИДА (ПЕРЕЗАПИСЬ БАЗЫ)...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => seedProducts())
  .catch((err) => {
    console.error("❌ Ошибка подключения к БД:", err);
    process.exit(1);
  });

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

const seedProducts = async () => {
  try {
    console.log("🗑 Удаляю старые товары...");
    await Product.deleteMany({});

    console.log(`📦 Записываю ${products.length} новых товаров...`);
    await Product.insertMany(products);

    console.log("✅ УСПЕХ! База данных обновлена.");
    console.log("👉 Теперь запусти: node migrate_local_products.js");
    
    process.exit();
  } catch (error) {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  }
};