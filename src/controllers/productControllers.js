const bcrypt = require("bcrypt");
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");
client.connect();

const fetchProducts = async (req, res, next) => {
  try {
    const SQL = `SELECT id, name FROM products;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const SQL = `INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;`;
    const response = await client.query(SQL, [uuid.v4(), req.body.name]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchProducts,
  createProduct,
};
