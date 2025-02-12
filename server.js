require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const express = require("express");
const cors = require("cors");
const { protect, isAdmin } = require("./middleware/authMiddleware");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes")); // Aquí manejarás productos
app.use("/api/orders", require("./routes/orderRoutes"));     // Aquí manejarás órdenes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
