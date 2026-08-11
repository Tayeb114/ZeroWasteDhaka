const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Route Mounts
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/waste-logs", require("./routes/wasteLogRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/claims", require("./routes/claimRoutes")); // Handles POST /api/claims
app.use("/api/reviews", require("./routes/reviewRoutes")); // Handles /api/reviews

// Root Route
app.get("/", (req, res) => {
  res.send("ZeroWaste Dhaka API is running successfully...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// Define Port
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

module.exports = app;