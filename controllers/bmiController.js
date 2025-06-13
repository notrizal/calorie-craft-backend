const { calculateBMIService } = require("../services/bmiService.js");
const { getRecipeByBMICategory } = require("../services/recipeService.js");

const calculateBMI = async (req, res) => {
    const { height, weight } = req.body;

    let result;
    try {
        result = calculateBMIService(height, weight);
        const recipes = await getRecipeByBMICategory(result.category);

        res.status(200).json({
            ...result,
            recipes,
        });
    } catch (err) {
        console.error("Error in calculateBMI:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { calculateBMI };
