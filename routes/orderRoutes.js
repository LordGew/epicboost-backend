const express = require("express");
const {createOrder, updateOrder, deleteOrder, getUserOrders} = require("../controller/orderController");
const {protect, isAdmin} = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/new-order", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);
router.get("/my-orders", protect, getUserOrders);

module.exports = router;