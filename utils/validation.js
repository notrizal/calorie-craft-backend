const validateHeightWeight = (height, weight) => {
    const numHeight = typeof height === "string" ? parseFloat(height) : height;
    const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;

    if (isNaN(numHeight) || isNaN(numWeight)) {
        return {
            isValid: false,
            error: "Height and weight must be valid numbers",
        };
    }

    if (typeof numHeight !== "number" || typeof numWeight !== "number") {
        return {
            isValid: false,
            error: "Height and weight must be numbers",
        };
    }

    if (numHeight <= 0 || numWeight <= 0) {
        return {
            isValid: false,
            error: "Height and weight must be positive numbers",
        };
    }

    if (numHeight < 0.3 || numHeight > 3) {
        return {
            isValid: false,
            error: "Height must be between 0.3 and 3 meters",
        };
    }

    if (numWeight < 0.5 || numWeight > 1000) {
        return {
            isValid: false,
            error: "Weight must be between 0.5 and 1000 kg",
        };
    }

    if (!Number.isFinite(numHeight) || !Number.isFinite(numWeight)) {
        return {
            isValid: false,
            error: "Height and weight must be finite numbers",
        };
    }

    return {
        isValid: true,
        height: numHeight,
        weight: numWeight,
    };
};

const validateHeightWeightSimple = (height, weight) => {
    const numHeight = typeof height === "string" ? parseFloat(height) : height;
    const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;

    return (
        !isNaN(numHeight) &&
        !isNaN(numWeight) &&
        typeof numHeight === "number" &&
        typeof numWeight === "number" &&
        Number.isFinite(numHeight) &&
        Number.isFinite(numWeight) &&
        numHeight > 0.3 &&
        numHeight < 3 &&
        numWeight > 0.5 &&
        numWeight < 1000
    );
};

const validateHeightWeightMiddleware = (req, res, next) => {
    const { height, weight } = req.body;

    const validation = validateHeightWeight(height, weight);

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: validation.error,
        });
    }

    req.validatedData = {
        height: validation.height,
        weight: validation.weight,
    };

    next();
};

module.exports = {
    validateHeightWeight,
    validateHeightWeightSimple,
    validateHeightWeightMiddleware,
};
