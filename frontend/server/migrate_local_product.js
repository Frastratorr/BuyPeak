import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, ".."); 

const PLACEHOLDER_URL = "https://placehold.co/400?text=No+Image"; 

dotenv.config();

console.log("🚀 ЗАПУСК МИГРАЦИИ ЛОКАЛЬНЫХ ТОВАРОВ...");
console.log(`📂 Корневая папка для поиска: ${FRONTEND_ROOT}`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => startMigration())
  .catch((err) => {
    console.error("❌ Ошибка БД:", err);
    process.exit(1);
  });

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

const startMigration = async () => {
  try {
    const products = await Product.find();
    let count = 0;

    for (const p of products) {
      if (p.image && !p.image.startsWith("http")) {
        console.log(`\n🔍 Товар: "${p.name}"`);
        
        const cleanPath = p.image.startsWith("/") || p.image.startsWith("\\") ? p.image.slice(1) : p.image;
        
        const filePath = path.join(FRONTEND_ROOT, cleanPath);

        if (fs.existsSync(filePath)) {
            console.log(`   📂 Нашел файл: ${filePath}`);
            console.log(`   📤 Загружаю...`);

            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: "buypeak_products",
                    resource_type: "image"
                });

                console.log(`   ✅ Успех! Ссылка: ${result.secure_url}`);
                
                await Product.updateOne({ _id: p._id }, { $set: { image: result.secure_url } });
                count++;

            } catch (uploadErr) {
                console.error(`   ❌ Ошибка Cloudinary: ${uploadErr.message}`);
            }

        } else {
            console.log(`   ⚠️ Файл НЕ НАЙДЕН: ${filePath}`);
            console.log(`   🛠 Ставлю заглушку.`);
            
            await Product.updateOne({ _id: p._id }, { $set: { image: PLACEHOLDER_URL } });
            count++;
        }
      }
    }

    console.log(`\n🎉 Готово! Обновлено: ${count}`);
    process.exit();

  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
};