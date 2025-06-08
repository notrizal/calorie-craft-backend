const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

// __filename dan __dirname tersedia secara langsung di CommonJS, tidak perlu fileURLToPath
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.SPOONACULAR_API_KEY;

const categoryApiParams = {
    Underweight: {
        minCalories: 600,
        minProtein: 25,
        sort: "calories",
        sortDirection: "desc",
    },
    "Normal weight": {
        minCalories: 400,
        maxCalories: 700,
        sort: "healthiness",
        sortDirection: "desc",
    },
    Overweight: {
        maxCalories: 500,
        minProtein: 20,
        sort: "calories",
        sortDirection: "asc",
    },
    Obesity: {
        maxCalories: 400,
        minProtein: 25,
        maxSugar: 10,
        sort: "calories",
        sortDirection: "asc",
    },
    default: {
        query: "healthy",
        sort: "healthiness",
        sortDirection: "desc",
    },
};

const getRecipeByBMICategory = async (category) => {
    const categoryParams =
        categoryApiParams[category] || categoryApiParams.default;

    const searchParams = new URLSearchParams({
        ...categoryParams,
        number: 100,
        addRecipeInformation: true,
        addRecipeNutrition: true,
        apiKey: API_KEY,
    });

    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?${searchParams.toString()}`;

    console.log(`[API Request] Fetching recipes for category: "${category}"`);
    console.log(`[API Request] URL: ${searchUrl}`);

    try {
        const response = await axios.get(searchUrl);
        const results = response.data.results;

        if (!results || results.length === 0) {
            console.warn(
                `Tidak ada resep yang cocok untuk kategori: ${category}`
            );
            return [];
        }

        const recipes = results.map((recipe) => {
            const caloriesData = recipe.nutrition?.nutrients?.find(
                (n) => n.name === "Calories"
            );

            return {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                calories: caloriesData
                    ? `${Math.round(caloriesData.amount)} ${caloriesData.unit}`
                    : "N/A",
                readyInMinutes: recipe.readyInMinutes,
            };
        });

        return recipes;
    } catch (error) {
        console.error("Gagal mengambil resep:", error.message);
        if (error.response && error.response.status === 401) {
            throw new Error(
                "Gagal otentikasi. Periksa kembali API Key Spoonacular Anda."
            );
        }
        throw new Error("Gagal mengambil data resep dari Spoonacular");
    }
};

const getRecipeDetailsById = async (id) => {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`;

    console.log(`[API Request] Fetching details for recipe ID: ${id}`);
    console.log(`[API Request] URL: ${url}`);

    try {
        const response = await axios.get(url);
        const data = response.data;

        return {
            id: data.id,
            title: data.title,
            image: data.image,
            ingredients: data.extendedIngredients.map((i) => i.original),
            instructions: data.instructions,
            analyzedInstructions: data.analyzedInstructions,
            nutrition: data.nutrition.nutrients.map((n) => ({
                name: n.name,
                amount: n.amount,
                unit: n.unit,
            })),
            sourceUrl: data.sourceUrl,
            spoonacularScore: data.spoonacularScore,
            healthScore: data.healthScore,
            readyInMinutes: data.readyInMinutes,
            servings: data.servings,
        };
    } catch (error) {
        console.error(
            `Gagal ambil detail resep untuk ID ${id}:`,
            error.message
        );
        if (error.response) {
            console.error(
                `Status: ${error.response.status}, Data:`,
                error.response.data
            );
            if (error.response.status === 402) {
                throw new Error(
                    "Kuota API Spoonacular harian Anda mungkin telah habis."
                );
            }
        }
        throw new Error("Tidak bisa mengambil detail resep.");
    }
};

module.exports = {
    getRecipeByBMICategory,
    getRecipeDetailsById,
};
