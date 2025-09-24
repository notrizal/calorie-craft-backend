const express = require("express");
const cors = require("cors");
const bmiRoutes = require("./routes/bmiRoutes.js");
const recipeRoutes = require("./routes/recipeRoutes.js");

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://calorie-craft-frontend.netlify.app",
];

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Routing
app.use("/api/bmi", bmiRoutes);
app.use("/api/recipes", recipeRoutes);

module.exports = app;
