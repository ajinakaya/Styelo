const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../security/auth");
const AuthValidation = require("../validation/authvalidation");
const {
  findAllUsers,
  findUserById,
  updateUser,
  Profile,
  deleteUser,
} = require("../controller/userController");

router.get("/users", findAllUsers);
router.get("/users/:id", findUserById);
router.put("/users/:id", AuthValidation, updateUser);
router.delete("/users/:id", deleteUser);
router.get("/Profile", authenticateToken, Profile);

module.exports = router;
