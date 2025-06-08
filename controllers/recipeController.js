const { getRecipeDetailsById } = require("../services/recipeService.js");

const getRecipeDetails = async (req, res) => {
    try {
        // Ambil ID dari parameter URL (misal: /api/recipes/12345)
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Recipe ID is required." });
        }

        const recipeDetails = await getRecipeDetailsById(id);

        // Kirim data resep sebagai respons JSON
        res.status(200).json(recipeDetails);
    } catch (error) {
        // Kirim pesan error jika terjadi masalah
        console.error(error); // Log error di server
        res.status(500).json({
            message: error.message || "An internal server error occurred.",
        });
    }
};

module.exports = { getRecipeDetails };
