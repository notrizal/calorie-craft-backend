const express = require("express");
const { getRecipeDetails } = require("../controllers/recipeController.js");

const router = express.Router();

router.get("/:id", getRecipeDetails);

module.exports = router;
