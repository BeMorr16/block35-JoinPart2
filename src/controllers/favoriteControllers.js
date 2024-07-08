const bcrypt = require("bcrypt");
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");
client.connect();

const fetchFavorites = async (req, res, next) => {
  try {
    const SQL = `
        SELECT favorite.id, username as name, name as product FROM favorite
        INNER JOIN users as users ON users.id = user_id
        INNER JOIN products as products ON products.id = product_id
        WHERE users.id = $1;
        `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    next(error);
  }
};

const createFavorite = async (req, res, next) => {
  try {
    const SQL = `
        INSERT INTO favorite(id, product_id, user_id) VALUES ($1, $2, $3) RETURNING *;
        `;
    const response = await client.query(SQL, [
      uuid.v4(),
      req.body.product_id,
      req.params.id,
    ]);
    res.status(201).send(response.rows[0]);
  } catch (error) {
    console.error("Error creating favorite:", error);
    next(error);
  }
};

const destroyFavorite = async (req, res, next) => {
  try {
    const SQL = `
    DELETE FROM favorite WHERE user_id = $1 AND id = $2;
    `;
    await client.query(SQL, [req.params.userId, req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    next(error);
  }
};

module.exports = {
  fetchFavorites,
  createFavorite,
  destroyFavorite,
};
