const Helper = require("../helpers");
const db = require("../models");

/**
 * Get user public datas by id
 * Also return email if the user to get == the current auth user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let userId = req.params.id;

    let user = await db.User.findByPk(userId);
    if (user == null) throw new Error("Utilisateur introuvable");

    return Helper.successResponse(req, res, { user }, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Report a user with reason
 * @param {*} req 
 * @param {*} res 
 * @returns response
 */
exports.report = async (req, res) => {
    try {
        let userId = req.params.id;

        if(!('content' in req.body))
            throw new Error("Veuillez spécifier une raison pour rapporter cet utilisateur");
    
        let user = await db.User.findByPk(userId);
        if (user == null) throw new Error("Utilisateur introuvable");

        await db.UserReport.create({
            UserId: user.id,
            FromUserId: req.user.userId,
            content: req.body.content
        });
    
        return Helper.successResponse(req, res, {}, hateoasUser(req));
      } catch (error) {
        console.error(error);
        return Helper.errorResponse(req, res, error.message);
      }
};

function hateoasUser(req) {
    const baseUri = req.protocol + "://" + req.get("host");
  
    return [
      {
        rel: "read",
        method: "GET",
        title: "Read User datas",
        href: baseUri + "/api/user/" + req.params.id,
      },
      {
        rel: "report",
        method: "POST",
        title: "Report a User",
        href: baseUri + "/api/user/"+ req.params.id +"/report",
      },
    ];
  }
  