const bouncer = require("express-bouncer")(5000, 900000, 3);
const jwt = require("jsonwebtoken");
const Helper = require("../helpers");
const db = require("../models");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await db.User.create({
      username: username,
      email: email,
      password: password,
    });

    bouncer.reset(req);
    return Helper.successResponse(req, res, {});
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.User.scope("withAll").findOne({ where: { email_hash: Helper.encrypt(email) } });
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

    return Helper.successResponse(req, res, { user, token });
  } catch (error) {
    console.error(error.message);
    return Helper.errorResponse(req, res, error.message);
  }
};

exports.readOne = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await db.User.findByPk(userId);
        if(user == null)
            throw new Error("Utilisateur introuvable");

        return Helper.successResponse(req, res, { user });
    } catch (error) {
        console.error(error);
        return Helper.errorResponse(req, res, error.message);
    }
};