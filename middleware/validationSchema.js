const Joi = require("joi");

const validationSchema = Joi.object({
    height: Joi.number().positive().precision(2).required().messages({
        "number.base": "Height must be a number.",
        "number.positive": "Height must be a positive value.",
        "number.precision": "Height must have at most 2 decimal places.",
        "any.required": "Height is a required field.",
    }),

    weight: Joi.number().positive().precision(2).required().messages({
        "number.base": "Weight must be a number.",
        "number.positive": "Weight must be a positive value.",
        "number.precision": "Weight must have at most 2 decimal places.",
        "any.required": "Weight is a required field.",
    }),

    gender: Joi.string()
        .lowercase()
        .valid("male", "female")
        .required()
        .messages({
            "string.base": "Gender must be a string.",
            "any.required": "Gender is a required field.",
            "any.only": "Gender must be either 'male' or 'female'.",
        }),
});

module.exports = validationSchema;
