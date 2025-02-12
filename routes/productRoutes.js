const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductsByID,
  createProduct,
  updateProduct,
  deleteProductByID
} = require("../controller/productController");

// GET /api/products  -> listar todos
router.get("/", getProducts);

// GET /api/products/:id -> obtener uno por ID
router.get("/:id", getProductsByID);

// POST /api/products -> crear un producto (solo admin)
router.post("/new-product", protect, isAdmin, createProduct);

// PUT /api/products/:id -> actualizar un producto (solo admin)
router.put("/:id", protect, isAdmin, updateProduct);

// DELETE /api/products/:id -> eliminar un producto (solo admin)
router.delete("/:id", protect, isAdmin, deleteProductByID);

module.exports = router;
