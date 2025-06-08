const express = require("express");
const cors = require("cors");
const bmiRoutes = require("./routes/bmiRoutes.js");
const recipeRoutes = require("./routes/recipeRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

// Routing
app.use("/api/bmi", bmiRoutes);
app.use("/api/recipes", recipeRoutes);

module.exports = app;
