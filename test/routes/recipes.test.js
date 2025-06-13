// test/services/recipeService.test.js

const axios = require("axios");
const {
    getRecipeByBMICategory,
    getRecipeDetailsById,
} = require("../../services/recipeService");

describe("Recipe Service", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ===================================================================
    // Pengujian untuk getRecipeByBMICategory
    // ===================================================================
    describe("getRecipeByBMICategory", () => {
        it("should fetch recipes for a valid category and format the result", async () => {
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
            jest.spyOn(axios, "get").mockResolvedValue(mockApiResponse);

            const recipes = await getRecipeByBMICategory("Normal weight");

            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("minCalories=400")
            );
            expect(recipes[0].title).toBe("Healthy Chicken Salad");
        });

        it("should use default parameters for an unknown category", async () => {
            jest.spyOn(axios, "get").mockResolvedValue({
                data: { results: [] },
            });
            await getRecipeByBMICategory("Unknown Category");
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("query=healthy")
            );
        });

        it("should return an empty array if API finds no recipes", async () => {
            jest.spyOn(axios, "get").mockResolvedValue({
                data: { results: [] },
            });
            const recipes = await getRecipeByBMICategory("Obesity");
            expect(recipes).toEqual([]);
        });

        it("should throw an authentication error on 401 status", async () => {
            const mockError = { response: { status: 401 } };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);
            await expect(getRecipeByBMICategory("Overweight")).rejects.toThrow(
                "Gagal otentikasi. Periksa kembali API Key Spoonacular Anda."
            );
        });

        // --- TES BARU UNTUK MENUTUPI ELSE BLOCK ---
        it("should throw a generic error for other API failures (e.g., 500 status)", async () => {
            // Arrange
            // Simulasikan error server dari API eksternal (bukan 401)
            const mockError = { response: { status: 500 } };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);

            // Act & Assert
            // Verifikasi bahwa error dari 'else' block yang dilemparkan
            await expect(getRecipeByBMICategory("Overweight")).rejects.toThrow(
                "Gagal mengambil data resep dari Spoonacular"
            );
        });
        // ---------------------------------------------
    });

    // ===================================================================
    // Pengujian untuk getRecipeDetailsById (Tidak ada perubahan di sini)
    // ===================================================================
    describe("getRecipeDetailsById", () => {
        it("should fetch and format recipe details for a given ID", async () => {
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
            const details = await getRecipeDetailsById(recipeId);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(details.id).toBe(recipeId);
        });

        it("should throw a quota error on 402 status", async () => {
            const recipeId = 12345;
            const mockError = {
                response: { status: 402, data: "Daily quota exceeded" },
            };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);
            await expect(getRecipeDetailsById(recipeId)).rejects.toThrow(
                "Kuota API Spoonacular harian Anda mungkin telah habis."
            );
        });

        it("should throw a generic error if recipe details cannot be fetched", async () => {
            const recipeId = 99999;
            const mockError = { response: { status: 404 } };
            jest.spyOn(axios, "get").mockRejectedValue(mockError);
            await expect(getRecipeDetailsById(recipeId)).rejects.toThrow(
                "Tidak bisa mengambil detail resep."
            );
        });

        it('should return "N/A" for calories if calorie data is missing', async () => {
            // Arrange
            const mockApiResponse = {
                data: {
                    results: [
                        // Resep ini TIDAK memiliki data nutrisi sama sekali
                        {
                            id: 456,
                            title: "Mystery Food",
                            image: "mystery.jpg",
                            readyInMinutes: 15,
                            // 'nutrition' property tidak ada
                        },
                        // Resep ini memiliki nutrisi, tapi tidak ada data 'Calories'
                        {
                            id: 789,
                            title: "Low-Cal Snack",
                            image: "snack.jpg",
                            readyInMinutes: 5,
                            nutrition: {
                                nutrients: [
                                    { name: "Protein", amount: 10, unit: "g" },
                                ],
                            },
                        },
                    ],
                },
            };

            jest.spyOn(axios, "get").mockResolvedValue(mockApiResponse);

            // Act
            const recipes = await getRecipeByBMICategory("Normal weight");

            // Assert
            expect(recipes).toHaveLength(2);
            // Verifikasi bahwa resep pertama (tanpa nutrisi) memiliki kalori "N/A"
            expect(recipes[0].id).toBe(456);
            expect(recipes[0].calories).toBe("N/A");

            // Verifikasi bahwa resep kedua (tanpa data kalori) juga memiliki kalori "N/A"
            expect(recipes[1].id).toBe(789);
            expect(recipes[1].calories).toBe("N/A");
        });
    });
});
