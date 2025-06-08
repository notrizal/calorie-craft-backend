const calculateBMIService = (heightCm, weightKg) => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obesity";

    return {
        bmi: bmi.toFixed(2),
        category,
    };
};

module.exports = {
    calculateBMIService,
};
