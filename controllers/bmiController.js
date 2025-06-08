const { calculateBMIService } = require("../services/bmiService.js");
const { getRecipeByBMICategory } = require("../services/recipeService.js");
const { validateHeightWeight } = require("../utils/validation.js");

const calculateBMI = async (req, res) => {
    const { height, weight } = req.body;

    if (!validateHeightWeight(height, weight)) {
        return res.status(400).json({ error: "Invalid height or weight" });
    }

    let result;
    try {
        result = calculateBMIService(height, weight);
        if (!result || !result.category) {
            throw new Error("BMI calculation failed or returned no category");
        }

        const recipes = await getRecipeByBMICategory(result.category);

        res.status(200).json({
            ...result,
            recipes,
        });
    } catch (err) {
        console.error("Error in calculateBMI:", err.message || err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { calculateBMI };
