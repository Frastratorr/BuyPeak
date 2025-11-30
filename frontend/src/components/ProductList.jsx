<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  {products.map(p => (
    <ProductCard key={p.id} {...p} />
  ))}
</Box>