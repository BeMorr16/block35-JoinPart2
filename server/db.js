const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const createTables = async () => {
  try {
    await client.connect();

    let SQL = `
        CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS favorite (
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_id_user_id UNIQUE (product_id, user_id)
        );
        `;
    await client.query(SQL);

    await client.query(
      "INSERT INTO users(id, username, password) VALUES($1, $2, $3)",
      [uuid.v4(), "ben", await bcrypt.hash("1234", 10)]
    );
    await client.query(
      "INSERT INTO users(id, username, password) VALUES($1, $2, $3)",
      [uuid.v4(), "jack", await bcrypt.hash("4321", 10)]
    );
    await client.query("INSERT INTO products(id, name) VALUES($1, $2)", [
      uuid.v4(),
      "fake tunnel",
    ]);
    await client.query("INSERT INTO products(id, name) VALUES($1, $2)", [
      uuid.v4(),
      "rocket",
    ]);

    console.log("Tables created and sample data inserted successfully");
  } catch (error) {
    console.error("Error creating tables or inserting data:", error);
  } finally {
    await client.end();
  }
};

createTables();
