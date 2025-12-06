const express = require("express");
const router = express.Router();
const {getFavorites, addToFavorites, removeFromFavorites} = require("../controllers/favoritesController");
const auth = require("../middlewares/authMiddleware");

// All require login
router.use(auth);

router.get("/", getFavorites);
router.post("/", addToFavorites);
router.delete("/:eventId", removeFromFavorites);

module.exports = router;
