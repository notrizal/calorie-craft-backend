// test/routes/bmiRoutes.test.js

describe("BMI Routes: POST /api/bmi/calculate", () => {
    let request;
    let app;
    let bmiService;
    let recipeService;

    // Setup yang sama seperti sebelumnya, sangat baik untuk isolasi
    beforeEach(() => {
        jest.resetModules();

        // Mock semua dependensi service yang digunakan oleh controller
        jest.mock("../../services/bmiService.js", () => ({
            calculateBMIService: jest.fn(),
        }));
        jest.mock("../../services/recipeService.js", () => ({
            getRecipeByBMICategory: jest.fn(),
        }));

        // Kita tidak perlu mock middleware validasi karena kita ingin menguji perilakunya

        request = require("supertest");
        app = require("../../app");
        bmiService = require("../../services/bmiService.js");
        recipeService = require("../../services/recipeService.js");
    });

    // --- Skenario 1: Kasus Sukses ---
    test("should return 200 with BMI and recipes for valid input", async () => {
        // Arrange
        const validInput = { weight: 80, height: 175, gender: "male" };
        const bmiResult = { bmi: "26.12", category: "Overweight" };
        const mockRecipes = [
            { id: 1, title: "Healthy Salad" },
            { id: 2, title: "Grilled Chicken" },
        ];

        // Atur mock untuk kedua service
        bmiService.calculateBMIService.mockReturnValue(bmiResult);
        recipeService.getRecipeByBMICategory.mockResolvedValue(mockRecipes);

        // Act
        const response = await request(app)
            .post("/api/bmi/calculate")
            .send(validInput);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...bmiResult,
            recipes: mockRecipes,
        });

        // Verifikasi bahwa service-service dipanggil dengan benar
        expect(bmiService.calculateBMIService).toHaveBeenCalledWith(
            validInput.height,
            validInput.weight
        );
        expect(recipeService.getRecipeByBMICategory).toHaveBeenCalledWith(
            bmiResult.category
        );
    });

    // --- Skenario 2: Kasus Gagal (Error dari Service) ---
    test("should return 500 if a service throws an error", async () => {
        // Arrange
        const validInput = { weight: 80, height: 175, gender: "male" };
        const bmiResult = { bmi: "26.12", category: "Overweight" };
        const errorMessage = "Database connection failed";

        // Atur satu mock untuk sukses, dan yang lain untuk gagal
        bmiService.calculateBMIService.mockReturnValue(bmiResult);
        recipeService.getRecipeByBMICategory.mockRejectedValue(
            new Error(errorMessage)
        );

        // Act
        const response = await request(app)
            .post("/api/bmi/calculate")
            .send(validInput);

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal server error" });
    });

    // --- Skenario 3: Kasus Gagal (Validasi Middleware) ---
    describe("Validation Middleware", () => {
        test("should return 422 for missing required fields", async () => {
            // Arrange
            const invalidInput = { weight: 80 }; // 'height' dan 'gender' hilang

            // Act
            const response = await request(app)
                .post("/api/bmi/calculate")
                .send(invalidInput);

            // Assert
            // Middleware validasi biasanya mengembalikan status 422 (Unprocessable Entity)
            // atau 400 (Bad Request). Sesuaikan jika perlu.
            expect(response.status).toBe(422);
            // Di dalam test "for missing required fields"
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    // Periksa error untuk 'height'
                    expect.objectContaining({
                        field: "height",
                        message: "Height is a required field.",
                    }),
                    // Periksa error untuk 'gender'
                    expect.objectContaining({
                        field: "gender",
                        message: "Gender is a required field.",
                    }),
                ])
            );
        });

        test("should return 422 for invalid gender value", async () => {
            // Arrange
            const invalidInput = { weight: 80, height: 175, gender: "other" };

            // Act
            const response = await request(app)
                .post("/api/bmi/calculate")
                .send(invalidInput);

            // Assert
            expect(response.status).toBe(422);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: "gender",
                        message: expect.stringContaining(
                            "Gender must be either male or female."
                        ), // Sesuaikan pesan error dari Zod/Joi Anda
                    }),
                ])
            );
        });

        test("should return 422 for non-numeric weight", async () => {
            // Arrange
            const invalidInput = {
                weight: "eighty",
                height: 175,
                gender: "male",
            };

            // Act
            const response = await request(app)
                .post("/api/bmi/calculate")
                .send(invalidInput);

            // Assert
            expect(response.status).toBe(422);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: "weight" }),
                ])
            );
        });
    });
});
