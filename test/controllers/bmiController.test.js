describe("BMI Controller - calculateBMI", () => {
    let req, res;
    let calculateBMI; // Untuk menyimpan fungsi controller
    let bmiService, recipeService; // Untuk menyimpan service yang sudah di-mock

    // `beforeEach` akan berjalan sebelum setiap `test()` di dalam `describe` ini.
    beforeEach(() => {
        // LANGKAH 1: Reset semua modul yang sudah di-cache oleh Jest.
        // Ini adalah langkah paling penting untuk memastikan kita mulai dari awal.
        jest.resetModules();

        // LANGKAH 2: Buat mock dengan factory, SEBELUM ada yang me-require-nya.
        // Ini memastikan bahwa setiap panggilan 'require' selanjutnya ke file ini akan menerima versi tiruan.
        jest.mock("../../services/bmiService.js", () => ({
            calculateBMIService: jest.fn(),
        }));
        jest.mock("../../services/recipeService.js", () => ({
            getRecipeByBMICategory: jest.fn(),
        }));

        // LANGKAH 3: SEKARANG, setelah mock didefinisikan, kita bisa me-require modulnya.
        // Variabel-variabel ini akan berisi modul tiruan yang baru saja kita buat.
        bmiService = require("../../services/bmiService.js");
        recipeService = require("../../services/recipeService.js");

        // LANGKAH 4: Terakhir, require controller yang akan kita tes.
        // Karena mock sudah ada, controller ini akan otomatis menggunakan service tiruan.
        const controller = require("../../controllers/bmiController.js");
        calculateBMI = controller.calculateBMI;

        // Siapkan objek req dan res seperti biasa.
        req = {
            body: { height: 175, weight: 70 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("should return 200 with BMI data and recipes on successful calculation", async () => {
        const mockBmiResult = { bmi: 22.9, category: "Normal" };
        const mockRecipes = [{ id: 1, name: "Salad Ayam Sehat" }];

        // Panggilan ini sekarang PASTI berhasil
        bmiService.calculateBMIService.mockReturnValue(mockBmiResult);
        recipeService.getRecipeByBMICategory.mockResolvedValue(mockRecipes);

        await calculateBMI(req, res);

        expect(bmiService.calculateBMIService).toHaveBeenCalledWith(175, 70);
        expect(recipeService.getRecipeByBMICategory).toHaveBeenCalledWith(
            "Normal"
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            ...mockBmiResult,
            recipes: mockRecipes,
        });
    });

    test("should return 500 if calculateBMIService fails", async () => {
        const errorMessage = "BMI calculation failed";
        bmiService.calculateBMIService.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await calculateBMI(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal server error",
        });
        expect(recipeService.getRecipeByBMICategory).not.toHaveBeenCalled();
    });

    test("should return 500 if getRecipeByBMICategory fails", async () => {
        const mockBmiResult = { bmi: 31.1, category: "Obesity" };
        const errorMessage = "Database connection error";

        bmiService.calculateBMIService.mockReturnValue(mockBmiResult);
        recipeService.getRecipeByBMICategory.mockRejectedValue(
            new Error(errorMessage)
        );

        await calculateBMI(req, res);

        expect(bmiService.calculateBMIService).toHaveBeenCalledWith(175, 70);
        expect(recipeService.getRecipeByBMICategory).toHaveBeenCalledWith(
            "Obesity"
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal server error",
        });
    });
});
