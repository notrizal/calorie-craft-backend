const request = require("supertest");
const app = require("../app");

describe("BMI Routes", () => {
    describe("Happy Path - POST /api/bmi/calculate", () => {
        let res; // Deklarasikan variabel 'res' di sini agar bisa diakses di semua 'it' block

        // Menggunakan 'beforeAll' untuk menjalankan request sekali saja untuk semua tes di describe block ini
        beforeAll(async () => {
            res = await request(app)
                .post("/api/bmi/calculate")
                .send({ weight: 70, height: 175 });
        });

        it("should return a 200 OK status code", () => {
            expect(res.statusCode).toBe(200);
        });

        it("should have the correct properties in the response body", () => {
            // Memeriksa struktur utama dari JSON
            expect(res.body).toHaveProperty("bmi");
            expect(res.body).toHaveProperty("category");
            expect(res.body).toHaveProperty("recipes");
        });

        it("should return the correct values and data types", () => {
            // PENTING: Memverifikasi 'bmi' sebagai STRING, sesuai gambar Anda
            expect(res.body.bmi).toBe("22.86");

            // Memverifikasi 'category'
            expect(res.body.category).toBe("Normal weight");

            // Memverifikasi bahwa 'recipes' adalah sebuah ARRAY
            expect(Array.isArray(res.body.recipes)).toBe(true);
            // atau cara Jest yang lebih modern:
            expect(res.body.recipes).toBeInstanceOf(Array);
        });

        it("should return a non-empty array of recipes", () => {
            // Tes yang bagus adalah memastikan array resep tidak kosong
            expect(res.body.recipes.length).toBeGreaterThan(0);
        });

        // ⭐ Tes Tambahan (Sangat Direkomendasikan) ⭐
        // Jika Anda tahu struktur objek di dalam array 'recipes', uji juga!
        // Asumsi resep memiliki properti 'name' (string) dan 'calories' (number)
        it("should have valid recipe objects inside the recipes array", () => {
            const firstRecipe = res.body.recipes[0];
            expect(firstRecipe).toHaveProperty("name");
            expect(firstRecipe).toHaveProperty("calories");

            expect(typeof firstRecipe.name).toBe("string");
            expect(typeof firstRecipe.calories).toBe("number");
        });
    });

    // Bagian "Unhappy Path" ini kemungkinan besar tidak perlu diubah.
    // Tetap penting untuk memastikan API Anda menangani input yang salah dengan benar.
    describe("Unhappy Path - POST /api/bmi/calculate", () => {
        const testCases = [
            { payload: { height: 175 }, description: "weight is missing" },
            {
                payload: { weight: 70, height: 0 },
                description: "height is zero",
            },
            {
                payload: { weight: "abc", height: 175 },
                description: "weight is not a number",
            },
        ];

        test.each(testCases)(
            "should return 400 when $description",
            async ({ payload }) => {
                const res = await request(app)
                    .post("/api/bmi/calculate")
                    .send(payload);

                expect(res.statusCode).toBe(400);
                expect(res.body).toHaveProperty("error");
            }
        );
    });
});
