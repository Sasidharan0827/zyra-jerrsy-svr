const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const approute = require("./routes/app.routes");
const mongoose = require("mongoose");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger.js");
const cookieParser = require("cookie-parser");
// Load environment variables
dotenv.config();

const app = express();
app.use(cookieParser());
// Middleware

app.use(express.json());
//looger
app.use(morgan("dev"));
// Swagger UI route (add this before your other routes)
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Simple route
app.get("/", (req, res) => {
  res.send(`Welcome to ${process.env.APP_NAME}`);
});
const allowedOrigins = [
  // "https://zyra.in", // live frontend (Angular/React/Vue etc.)
  "http://localhost:3000",
  "http://localhost:4200",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ if you're sending cookies or tokens
  })
);
// Use router
app.use("/zaira", approute);
// Start server

mongoose
  .connect(process.env.DB) // No need for options
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    // console.log(
    //   `📚 API Documentation available at http://localhost:${PORT}/api`
    // );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
