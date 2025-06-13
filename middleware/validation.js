const Joi = require("joi");

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            convert: false,
        });

        if (!error) {
            return next();
        }

        const errors = error.details.map((detail) => ({
            field: detail.path[0],
            message: detail.message.replace(/['"]/g, ""),
        }));

        console.log(errors);

        return res.status(422).json({
            status: "error",
            message: "Input not valid",
            errors: errors,
        });
    };
};

module.exports = validate;
