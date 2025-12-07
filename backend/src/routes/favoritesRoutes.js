const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require("../controllers/favoritesController");

router.use(auth); // user must be logged in

router.post("/:eventId", addFavorite);
router.delete("/:eventId", removeFavorite);
router.get("/", getFavorites);

module.exports = router;
