const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5173;
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");

const userRoutes = require("../src/routes/userRoutes");
const productRoutes = require("../src/routes/productRoutes");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).send({ error: "An error occurred, please try again later." });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
