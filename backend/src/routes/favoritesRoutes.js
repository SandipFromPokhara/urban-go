const express = require("express");
const router = express.Router();
const {getFavorites, addToFavorites, removeFromFavorites} = require("../controllers/favoritesController");
const authMiddleware = require("../middlewares/authMiddleware");

// All require login
router.use(authMiddleware);

router.get("/", getFavorites);
router.post("/", addToFavorites);
router.delete("/:eventId", removeFromFavorites);

module.exports = router;
