// src/middlewares/validateUSer.js

const validator = require("validator");

const validateSignup = (req, res, next) => {
    try {
        let { firstName, lastName, email, password, dateOfBirth, address } = req.body;

        if (!firstName || !lastName || !email || !password || !dateOfBirth || !address) {
            throw new Error("Please provide all fields");
        }

        if (!address.street || !address.city || !address.postalCode) {
            throw new Error("Incomplete address");
        }

        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim().toLowerCase();
        address.street = address.street.trim();
        address.city = address.city.trim();
        address.postalCode = address.postalCode.trim();

        const nameValidator = /^[a-zA-ZäöåÄÖÅ]+(?:[ '-][a-zA-ZäöåÄÖÅ]+)*$/;
        if (!nameValidator.test(firstName)) throw new Error("Invalid first name format");
        if (!nameValidator.test(lastName)) throw new Error("Invalid last name format");

        if (!validator.isEmail(email)) throw new Error("Invalid email format");

        if (!validator.isStrongPassword(password)) throw new Error("Password not strong enough");

        if (isNaN(Date.parse(dateOfBirth))) throw new Error("Invalid date format");

        const addressValidator = /^[a-zA-ZäöåÄÖÅ0-9.,'/#() -]+$/;
        if (!addressValidator.test(address.street)) throw new Error("Invalid street format");
        if (!addressValidator.test(address.city)) throw new Error("Invalid city format");
        if (!/^\d{5}$/.test(address.postalCode)) throw new Error("Invalid postal code");

        // Attach cleaned data to req
        req.body.firstName = firstName;
        req.body.lastName = lastName;
        req.body.email = email;
        req.body.address = address;

        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const validateLogin = (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password ) throw new Error("Both fields must be filled");

        email = email.trim().toLowerCase();
        req.body.email = email;

        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = { validateSignup, validateLogin };