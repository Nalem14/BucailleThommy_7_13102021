const bouncer = require("express-bouncer")(5000, 900000, 3);
const jwt = require("jsonwebtoken");
const Helper = require("../helpers");
const db = require("../models");

/**
 * Create a user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await db.User.create({
      username: username,
      email: email,
      password: password,
    });

    bouncer.reset(req);
    return Helper.successResponse(req, res, {}, hateoasAuth(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Login a user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.User.scope("withAll").findOne({
      where: { email_hash: Helper.encrypt(email) },
    });
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

    return Helper.successResponse(req, res, { user, token }, hateoasAuth(req));
  } catch (error) {
    console.error(error.message);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Return current user datas
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readMe = async (req, res) => {
  try {
    let userId = req.user.userId;
    let user = await getUserDatas(userId);

    return Helper.successResponse(req, res, { user }, hateoasAuth(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Export current user datas
 * @param {*} req
 * @param {*} res
 * @returns download
 */
exports.exportMe = async (req, res) => {
  try {
    let userId = req.user.userId;
    let user = await getUserDatas(userId);

    var text = JSON.stringify(user);
    res.attachment("user-datas.txt");
    res.type("txt");

    return res.status(200).send(text);
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Update the logged-in user
 * @param {*} req 
 * @param {*} res 
 * @returns response
 */
exports.update = async (req, res) => {
    try {
        let userId = req.user.userId
        let user = await db.User.scope("withAll").findByPk(userId);
    
        if (user == null) throw new Error("Utilisateur introuvable");

        // If user field is sent, update attribute
        if('email' in req.body) {
            user.email = req.body.email;
        }

        // If password field is sent, update attribute
        if('password' in req.body && 'confirmPassword' in req.body && 'oldPassword' in req.body) {
            if(user.authenticate(req.body.oldPassword)) {
                if(req.body.password == req.body.confirmPassword) {
                    user.password = req.body.password;
                }else{
                    throw new Error("La confirmation du nouveau mot de passe ne correspond pas au nouveau mot de passe.")
                }
            }else{
                throw new Error("Votre ancien mot de passe ne correspond pas.")
            }
        }

        // Save the user in DB
        await user.save();
    
        return Helper.successResponse(req, res, {}, hateoasUser(req));
      } catch (error) {
        console.error(error);
        return Helper.errorResponse(req, res, error.message);
      }
};

exports.delete = async (req, res) => {
    try {
        let userId = req.user.userId
        let confirmPassword = req.body.password;
        let user = await db.User.scope('withPassword').findByPk(userId);
    
        if (user == null) 
            throw new Error("Utilisateur introuvable");
        if(!user.authenticate(confirmPassword))
            throw new Error("Mot de passe invalide");

        // Destroy the user in DB
        await user.destroy();
    
        return Helper.successResponse(req, res, {}, hateoasUser(req));
      } catch (error) {
        console.error(error);
        return Helper.errorResponse(req, res, error.message);
      }
};

async function getUserDatas(userId) {
    let user = await db.User.scope("withAll").findByPk(userId, {
      include: [
        db.Post,
        db.Community,
        db.CommunityModerator,
        db.Follower,
        db.PrivateMessage,
        db.Notification,
        db.UserReport
      ],
    });
  
    if (user == null) throw new Error("Utilisateur introuvable");
  
    return user;
  }

function hateoasAuth(req) {
    const baseUri = req.protocol + "://" + req.get("host");
  
    return [
      {
        rel: "create",
        method: "POST",
        title: "Create User",
        href: baseUri + "/api/auth/signup",
      },
      {
        rel: "login",
        method: "POST",
        title: "Login User",
        href: baseUri + "/api/auth/login",
      },
      {
        rel: "read",
        method: "GET",
        title: "Read User datas",
        href: baseUri + "/api/auth/read",
      },
      {
        rel: "export",
        method: "GET",
        title: "Export User datas",
        href: baseUri + "/api/auth/export",
      },
      {
        rel: "update",
        method: "PUT",
        title: "Update User",
        href: baseUri + "/api/auth/update",
      },
      {
        rel: "delete",
        method: "DELETE",
        title: "Delete User",
        href: baseUri + "/api/auth/delete",
      },
    ];
  }