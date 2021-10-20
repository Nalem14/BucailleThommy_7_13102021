const bouncer = require('express-bouncer')(5000, 900000, 3);
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.signup = async (req, res) => {
    try {
        let user = await db.User.create({
            username: "Nalem",
            email: "nalem.14360@gmail.com",
            password: "Zhr1R0ZZeA$14"
        });
        db.User.findByPk(1)
                .then(user => {
                    console.log(user.authenticate("Zhr1R0ZZeA$14") === true);
                });

        bouncer.reset(req);
        res.status(201).json({ message: "Votre compte a bien été créé." });
    }
    catch(error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
};