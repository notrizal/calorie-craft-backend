// test/middleware/validation.test.js

const validate = require("../../middleware/validation");
// Impor skema validasi yang sebenarnya
const validationSchema = require("../../middleware/validationSchema");

describe("Validation Middleware with BMI Schema", () => {
    let mockReq;
    let mockRes;
    let nextFn;

    // Setup tiruan req, res, dan next sebelum setiap tes
    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFn = jest.fn();
    });

    // Buat instance middleware yang akan kita uji
    const middleware = validate(validationSchema);

    // --- Kelompok Tes untuk Skenario Sukses ---
    describe("Successful Validation", () => {
        test("should call next() for valid and complete input", () => {
            // Arrange
            mockReq.body = { height: 175, weight: 70, gender: "male" };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(nextFn).toHaveBeenCalledTimes(1);
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        test("should return 422 for case-insensitive gender when conversion is off", () => {
            // Arrange
            mockReq.body = { height: 170, weight: 65, gender: "FEMALE" };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(nextFn).not.toHaveBeenCalled(); // Pastikan next() TIDAK dipanggil
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining([
                        // Verifikasi pesan error yang sebenarnya dari log
                        expect.objectContaining({
                            field: "gender",
                            message: "Gender must be either male or female.",
                        }),
                        expect.objectContaining({
                            field: "gender",
                            message:
                                "gender must only contain lowercase characters",
                        }),
                    ]),
                })
            );
        });

        test("should call next() for valid input with unknown fields", () => {
            // Arrange
            mockReq.body = {
                height: 180,
                weight: 80,
                gender: "male",
                notes: "extra field",
            };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(nextFn).toHaveBeenCalledTimes(1);
        });
    });

    // --- Kelompok Tes untuk Skenario Gagal ---
    describe("Failing Validation", () => {
        test("should return 422 if required fields are missing", () => {
            // Arrange
            mockReq.body = {}; // Body kosong

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(nextFn).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "error",
                message: "Input not valid",
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: "height",
                        message: "Height is a required field.",
                    }),
                    expect.objectContaining({
                        field: "weight",
                        message: "Weight is a required field.",
                    }),
                    expect.objectContaining({
                        field: "gender",
                        message: "Gender is a required field.",
                    }),
                ]),
            });
        });

        test("should return 422 for invalid data types", () => {
            // Arrange
            mockReq.body = { height: "tall", weight: "heavy", gender: 123 };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: "height",
                            message: "Height must be a number.",
                        }),
                        expect.objectContaining({
                            field: "weight",
                            message: "Weight must be a number.",
                        }),
                        // Pesan error dari Joi untuk gender akan menjadi "any.only" karena 123 tidak valid
                        // atau "string.base" tergantung versi Joi. Kita uji pesan yang lebih spesifik.
                        expect.objectContaining({
                            field: "gender",
                            message: "Gender must be either male or female.",
                        }),
                    ]),
                })
            );
        });

        test("should return 422 for values that violate rules (negative, invalid enum)", () => {
            // Arrange
            mockReq.body = { height: -170, weight: 0, gender: "other" };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: "height",
                            message: "Height must be a positive value.",
                        }),
                        expect.objectContaining({
                            field: "weight",
                            message: "Weight must be a positive value.",
                        }),
                        expect.objectContaining({
                            field: "gender",
                            message: "Gender must be either male or female.",
                        }),
                    ]),
                })
            );
        });

        test("should return 422 for numbers with too many decimal places", () => {
            // Arrange
            mockReq.body = { height: 175.123, weight: 70.456, gender: "male" };

            // Act
            middleware(mockReq, mockRes, nextFn);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            field: "height",
                            message:
                                "Height must have at most 2 decimal places.",
                        }),
                        expect.objectContaining({
                            field: "weight",
                            message:
                                "Weight must have at most 2 decimal places.",
                        }),
                    ]),
                })
            );
        });
    });
});
