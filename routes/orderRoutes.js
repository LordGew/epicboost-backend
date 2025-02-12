const express = require("express");
const {createOrder} = require("../controller/orderController");
const {protect, isAdmin} = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/new-order", protect, isAdmin, createOrder);

module.exports = router;