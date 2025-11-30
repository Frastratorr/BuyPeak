import { useState } from "react";
import ProductCard from '../components/ProductCard';
import { productsData } from "../data/products";

export default function Catalog() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");

  const products = productsData.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minQuantity && p.quantity < Number(minQuantity)) return false;
    if (maxQuantity && p.quantity > Number(maxQuantity)) return false;
    return true;
  });
  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px", overflowX: "hidden" }}>

      {/* ---------- ЛЕВАЯ ЧАСТЬ (КАТАЛОГ) ---------- */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ marginBottom: "20px" }}>Каталог товаров</h1>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            width: "100%"
          }}
        >
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* ---------- ПРАВАЯ ЧАСТЬ (ФИЛЬТРЫ) ---------- */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          background: "white",
          position: "fixed",
          top: "58px",
          right: "20px",
          height: "fit-content",
          marginTop: '38px'
        }}
      >
        <h3>Фильтры 🔍</h3>

        {/* Фильтр по цене */}
        <div style={{ marginTop: "20px" }}>
          <label>Мин. цена</label>
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ marginTop: "15px", display: "block" }}>Макс. цена</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ marginTop: "15px", display: "block" }}>Мин. количество</label>
          <input
            type="number"
            value={minQuantity}
            onChange={e => setMinQuantity(e.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            />

            <label style={{ marginTop: "15px", display: "block" }}>Макс. количество</label>
            <input
              type="number"
              value={maxQuantity}
              onChange={e => setMaxQuantity(e.target.value)}
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
        </div>

        {/* Кнопка сброса */}
        <button
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            setMaxQuantity("");
            setMinQuantity("");
          }}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}
