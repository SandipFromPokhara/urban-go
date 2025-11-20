const express = require("express");
const router = express.Router();
<<<<<<< HEAD:backend/src/routes/userRouter.js
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
=======
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } =require("../controllers/userControllers");
>>>>>>> 8b16272579adfaa369ece791429b7f74a72b1721:backend/mocks/routes/userRouter.js

// GET /users
router.get("/", getAllUsers);

// POST /users
router.post("/", createUser);

// GET /users/:userId
router.get("/:userId", getUserById);

// PUT /users/:userId
router.put("/:userId", updateUser);

// DELETE /users/:userId
router.delete("/:userId", deleteUser);

module.exports = router;
