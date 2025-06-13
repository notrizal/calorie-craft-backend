// 1. Import axios seperti biasa
const axios = require("axios");
const {
    getRecipeByBMICategory,
    getRecipeDetailsById,
} = require("../../services/recipeService"); // <-- Sesuaikan path ke file Anda

// TIDAK PERLU jest.mock('axios') LAGI

describe("Recipe Service", () => {
    // 2. Gunakan jest.restoreAllMocks untuk membersihkan spy setelah setiap tes
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ===================================================================
    // Pengujian untuk getRecipeByBMICategory
    // ===================================================================
    describe("getRecipeByBMICategory", () => {
        it("should fetch recipes for a valid category and format the result", async () => {
            // Arrange
            const mockApiResponse = {
                data: {
                    results: [
                        {
                            id: 123,
                            title: "Healthy Chicken Salad",
                            image: "image.jpg",
                            readyInMinutes: 20,
                            nutrition: {
                                nutrients: [
                                    {
                                        name: "Calories",
                                        amount: 450,
                                        unit: "kcal",
                                    },
                                ],
                            },
                        },
                    ],
                },
            };
            // 3. Gunakan jest.spyOn untuk menargetkan axios.get dan ganti implementasinya
            jest.spyOn(axios, "get").mockImplementation(() =>
                Promise.resolve(mockApiResponse)
            );

            // Act
            const recipes = await getRecipeByBMICategory("Normal weight");

            // Assert
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("minCalories=400")
            );
            expect(recipes[0].title).toBe("Healthy Chicken Salad");
        });

        it("should use default parameters for an unknown category", async () => {
            // Arrange
            jest.spyOn(axios, "get").mockResolvedValue({
                data: { results: [] },
            });

            // Act
            await getRecipeByBMICategory("Unknown Category");

            // Assert
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("query=healthy")
            );
        });

        it("should return an empty array if API finds no recipes", async () => {
            // Arrange
            jest.spyOn(axios, "get").mockResolvedValue({
                data: { results: [] },
            });

            // Act
            const recipes = await getRecipeByBMICategory("Obesity");

            // Assert
            expect(recipes).toEqual([]);
        });

        it("should throw an authentication error on 401 status", async () => {
            // Arrange
            const mockError = { response: { status: 401 } };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);

            // Act & Assert
            await expect(getRecipeByBMICategory("Overweight")).rejects.toThrow(
                "Gagal otentikasi. Periksa kembali API Key Spoonacular Anda."
            );
        });
    });

    // ===================================================================
    // Pengujian untuk getRecipeDetailsById
    // ===================================================================
    describe("getRecipeDetailsById", () => {
        it("should fetch and format recipe details for a given ID", async () => {
            // Arrange
            const recipeId = 716429;
            const mockApiResponse = {
                data: {
                    id: recipeId,
                    title: "Pasta with Garlic",
                    image: "pasta.jpg",
                    extendedIngredients: [{ original: "1 lb spaghetti" }],
                    instructions: "Cook pasta.",
                    analyzedInstructions: [],
                    nutrition: {
                        nutrients: [
                            { name: "Calories", amount: 500, unit: "kcal" },
                        ],
                    },
                    sourceUrl: "http://example.com",
                    spoonacularScore: 95,
                    healthScore: 80,
                    readyInMinutes: 15,
                    servings: 4,
                },
            };
            jest.spyOn(axios, "get").mockResolvedValue(mockApiResponse);

            // Act
            const details = await getRecipeDetailsById(recipeId);

            // Assert
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(details.id).toBe(recipeId);
        });

        it("should throw a quota error on 402 status", async () => {
            // Arrange
            const recipeId = 12345;
            const mockError = {
                response: { status: 402, data: "Daily quota exceeded" },
            };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);

            // Act & Assert
            await expect(getRecipeDetailsById(recipeId)).rejects.toThrow(
                "Kuota API Spoonacular harian Anda mungkin telah habis."
            );
        });

        it("should throw a generic error if recipe details cannot be fetched", async () => {
            // Arrange
            const recipeId = 99999;
            const mockError = { response: { status: 404 } };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);

            -(
                // Act & Assert
                (await expect(getRecipeDetailsById(recipeId)).rejects.toThrow(
                    "Tidak bisa mengambil detail resep."
                ))
            );
        });

        it("should throw a generic error for network issues (no response object)", async () => {
            // Arrange
            const recipeId = 12345;
            // Simulasikan error jaringan, yang merupakan objek Error biasa tanpa properti 'response'
            const networkError = new Error("Network Error");
            jest.spyOn(axios, "get").mockRejectedValue(networkError);

            // Act & Assert
            // Verifikasi bahwa error generik yang dilemparkan, karena alur akan "jatuh"
            // melewati blok 'if (error.response)'
            await expect(getRecipeDetailsById(recipeId)).rejects.toThrow(
                "Tidak bisa mengambil detail resep."
            );
        });
    });
});
