const { calculateBMIService } = require("../../services/bmiService"); // Sesuaikan path file

describe("calculateBMIService", () => {
    describe("BMI Calculation", () => {
        test("should calculate BMI correctly with valid inputs", () => {
            const result = calculateBMIService(170, 70);
            expect(result.bmi).toBe("24.22");
        });

        test("should handle decimal height and weight", () => {
            const result = calculateBMIService(175.5, 68.5);
            expect(result.bmi).toBe("22.24");
        });

        test("should return BMI with 2 decimal places", () => {
            const result = calculateBMIService(180, 80);
            expect(result.bmi).toMatch(/^\d+\.\d{2}$/);
        });
    });

    describe("Category Classification", () => {
        test('should classify as "Underweight" when BMI < 18.5', () => {
            // BMI = 17.3
            const result = calculateBMIService(170, 50);
            expect(result.category).toBe("Underweight");
            expect(parseFloat(result.bmi)).toBeLessThan(18.5);
        });

        test('should classify as "Underweight" at BMI boundary (18.49)', () => {
            // BMI ≈ 18.37
            const result = calculateBMIService(165, 50);
            expect(result.category).toBe("Underweight");
        });

        test('should classify as "Normal weight" when BMI is 18.5', () => {
            // BMI = 18.51
            const result = calculateBMIService(170, 53.5);
            expect(result.category).toBe("Normal weight");
        });

        test('should classify as "Normal weight" when BMI is between 18.5-24.9', () => {
            // BMI = 22.49
            const result = calculateBMIService(170, 65);
            expect(result.category).toBe("Normal weight");
            expect(parseFloat(result.bmi)).toBeGreaterThanOrEqual(18.5);
            expect(parseFloat(result.bmi)).toBeLessThan(24.9);
        });

        test('should classify as "Normal weight" at BMI boundary (24.89)', () => {
            // BMI ≈ 24.84
            const result = calculateBMIService(170, 71.8);
            expect(result.category).toBe("Normal weight");
        });

        test('should classify as "Overweight" when BMI is 25.0', () => {
            // BMI ≈ 25.0
            const result = calculateBMIService(170, 72.25);
            expect(result.category).toBe("Overweight");
        });

        test('should classify as "Overweight" when BMI is between 25.0-29.9', () => {
            // BMI ≈ 27.68
            const result = calculateBMIService(170, 80);
            expect(result.category).toBe("Overweight");
            expect(parseFloat(result.bmi)).toBeGreaterThanOrEqual(25.0);
            expect(parseFloat(result.bmi)).toBeLessThan(29.9);
        });

        test('should classify as "Overweight" at BMI boundary (29.89)', () => {
            // BMI ≈ 29.84
            const result = calculateBMIService(170, 86.2);
            expect(result.category).toBe("Overweight");
        });

        test('should classify as "Obesity" when BMI is 30.0', () => {
            // BMI ≈ 30.0
            const result = calculateBMIService(170, 86.7);
            expect(result.category).toBe("Obesity");
        });

        test('should classify as "Obesity" when BMI >= 30', () => {
            // BMI ≈ 34.60
            const result = calculateBMIService(170, 100);
            expect(result.category).toBe("Obesity");
            expect(parseFloat(result.bmi)).toBeGreaterThanOrEqual(30.0);
        });
    });

    describe("Return Object Structure", () => {
        test("should return object with correct properties", () => {
            const result = calculateBMIService(170, 70);
            expect(result).toHaveProperty("bmi");
            expect(result).toHaveProperty("category");
            expect(Object.keys(result)).toHaveLength(2);
        });

        test("should return BMI as string", () => {
            const result = calculateBMIService(170, 70);
            expect(typeof result.bmi).toBe("string");
        });

        test("should return category as string", () => {
            const result = calculateBMIService(170, 70);
            expect(typeof result.category).toBe("string");
        });
    });

    describe("Edge Cases", () => {
        test("should handle very low weight", () => {
            const result = calculateBMIService(170, 30);
            expect(result.bmi).toBe("10.38");
            expect(result.category).toBe("Underweight");
        });

        test("should handle very high weight", () => {
            const result = calculateBMIService(170, 150);
            expect(result.bmi).toBe("51.90");
            expect(result.category).toBe("Obesity");
        });

        test("should handle very short height", () => {
            const result = calculateBMIService(140, 50);
            expect(result.bmi).toBe("25.51");
            expect(result.category).toBe("Overweight");
        });

        test("should handle very tall height", () => {
            const result = calculateBMIService(200, 80);
            expect(result.bmi).toBe("20.00");
            expect(result.category).toBe("Normal weight");
        });

        test("should handle integer inputs that result in repeating decimals", () => {
            const result = calculateBMIService(175, 75);
            expect(result.bmi).toBe("24.49");
            expect(result.category).toBe("Normal weight");
        });
    });

    describe("Real World Examples", () => {
        test("should work with typical adult male example", () => {
            // Tinggi 175cm, Berat 70kg
            const result = calculateBMIService(175, 70);
            expect(result.bmi).toBe("22.86");
            expect(result.category).toBe("Normal weight");
        });

        test("should work with typical adult female example", () => {
            // Tinggi 160cm, Berat 55kg
            const result = calculateBMIService(160, 55);
            expect(result.bmi).toBe("21.48");
            expect(result.category).toBe("Normal weight");
        });

        test("should work with overweight example", () => {
            // Tinggi 165cm, Berat 80kg
            const result = calculateBMIService(165, 80);
            expect(result.bmi).toBe("29.38");
            expect(result.category).toBe("Overweight");
        });

        test("should work with obese example", () => {
            // Tinggi 160cm, Berat 85kg
            const result = calculateBMIService(160, 85);
            expect(result.bmi).toBe("33.20");
            expect(result.category).toBe("Obesity");
        });
    });
});
