const express = require("express");
const { calculateBMI } = require("../controllers/bmiController.js");
const validate = require("../middleware/validation.js");
const validationSchema = require("../middleware/validationSchema.js");

const router = express.Router();

router.post("/calculate", validate(validationSchema), calculateBMI);

module.exports = router;
