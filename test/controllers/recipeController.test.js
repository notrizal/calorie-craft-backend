// test/controllers/recipeController.test.js

// Sama seperti sebelumnya, kita biarkan bagian atas kosong.
// Semua 'require' dan 'mock' akan dilakukan di dalam 'beforeEach'.

describe("Recipe Controller - getRecipeDetails", () => {
    let req, res;
    let getRecipeDetails; // Variabel untuk menyimpan fungsi controller
    let recipeService; // Variabel untuk menyimpan service yang sudah di-mock

    // Setup akan diulang untuk setiap tes, memastikan isolasi penuh.
    beforeEach(() => {
        // LANGKAH 1: Hapus semua cache modul
        jest.resetModules();

        // LANGKAH 2: Definisikan mock untuk service SEBELUM di-require
        jest.mock("../../services/recipeService.js", () => ({
            // Definisikan fungsi yang akan kita mock di dalam service ini
            getRecipeDetailsById: jest.fn(),
        }));

        // LANGKAH 3: Sekarang, require service yang sudah di-mock
        recipeService = require("../../services/recipeService.js");

        // LANGKAH 4: Terakhir, require controller yang akan kita tes
        const controller = require("../../controllers/recipeController.js");
        getRecipeDetails = controller.getRecipeDetails;

        // Setup objek req dan res tiruan
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    // TEST CASE 1: Skenario Sukses
    test("should return 200 with recipe details for a valid ID", async () => {
        // Arrange: Siapkan request dengan ID dan siapkan hasil dari service
        req = { params: { id: "12345" } };
        const mockRecipeDetails = {
            id: "12345",
            name: "Sup Ayam",
            calories: 300,
        };
        recipeService.getRecipeDetailsById.mockResolvedValue(mockRecipeDetails);

        // Act: Jalankan fungsi controller
        await getRecipeDetails(req, res);

        // Assert: Pastikan service dipanggil dengan benar dan response sesuai
        expect(recipeService.getRecipeDetailsById).toHaveBeenCalledWith(
            "12345"
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRecipeDetails);
    });

    // TEST CASE 2: Skenario Gagal (ID tidak ada)
    test("should return 400 if recipe ID is not provided", async () => {
        // Arrange: Buat request tanpa ID
        req = { params: {} }; // id tidak ada di params

        // Act: Jalankan fungsi controller
        await getRecipeDetails(req, res);

        // Assert: Pastikan response 400 dikirim dan service tidak pernah dipanggil
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Recipe ID is required.",
        });
        expect(recipeService.getRecipeDetailsById).not.toHaveBeenCalled();
    });

    // TEST CASE 3: Skenario Gagal (Service error, misal resep tidak ditemukan)
    test("should return 500 if the service throws an error", async () => {
        // Arrange: Buat request dengan ID, dan buat service melempar error
        req = { params: { id: "67890" } };
        const errorMessage = "Recipe not found with id 67890";
        recipeService.getRecipeDetailsById.mockRejectedValue(
            new Error(errorMessage)
        );

        // Act: Jalankan fungsi controller
        await getRecipeDetails(req, res);

        // Assert: Pastikan service dipanggil, tapi controller menangani errornya
        expect(recipeService.getRecipeDetailsById).toHaveBeenCalledWith(
            "67890"
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});
