const router = require("express").Router();
const { fetchUsers, createUser } = require("../controllers/userControllers");
const {
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("../controllers/favoriteControllers");

router.get("/", fetchUsers);
router.post("/", createUser);
router.get("/:id/favorites", fetchFavorites);
router.post("/:id/favorites", createFavorite);
router.delete("/:userId/favorites/:id", destroyFavorite);

module.exports = router;
