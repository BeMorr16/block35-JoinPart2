const bcrypt = require("bcrypt");
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");
client.connect();

const fetchUsers = async (req, res, next) => {
  try {
    const SQL = `SELECT id, username FROM users;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const SQL = `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;`;
    const response = await client.query(SQL, [
      uuid.v4(),
      req.body.username,
      hashedPassword,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchUsers,
  createUser,
};
