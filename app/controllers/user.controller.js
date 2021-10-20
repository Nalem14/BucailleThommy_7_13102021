const bouncer = require("express-bouncer")(5000, 900000, 3);
const jwt = require("jsonwebtoken");
const Helper = require("../helpers");
const db = require("../models");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await db.User.create({
      username: username,
      email: email,
      password: password,
    });

    bouncer.reset(req);
    Helper.successResponse(req, res, {});
  } catch (error) {
    console.error(error);
    Helper.errorResponse(req, res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.User.findOne({ where: { email: email } });
    if (user == null) throw new Error("Email / Mot de passe invalide.");

    if (!user.authenticate(password))
      throw new Error("Email / Mot de passe invalide.");

    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET,
      { expiresIn: "24h" }
    );

    Helper.successResponse(req, res, { user, token });
  } catch (error) {
    console.error(error.message);
    Helper.errorResponse(req, res, error.message);
  }
};
