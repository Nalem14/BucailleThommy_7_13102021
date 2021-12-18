const db = require("../models");
const jwt = require("jsonwebtoken");

exports.init = (http, corsOptions) => {
  const io = require("socket.io")(http, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    authenticate(io, socket);
  });
};

async function authenticate(io, socket) {
  try {
    let token = socket.handshake.auth.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const decodedUser = decodedToken.user;
  
    // Update lastseenAt attribute of current user
    let user = await db.User.findByPk(decodedUser.userId);
    if(user == null)
      throw new Error("User not found")
  
    console.log("[SocketIO] User " + user.username + " connected with token " + token);
    await listenEvents(io, socket, user);
  }
  catch(error) {
    console.log("[SocketIO] Error on authenticating user:", error);
    socket.disconnect();
  }
}

async function listenEvents(io, socket, user) {
  socket.on("disconnect", () => {
    console.log("[SocketIO] User " + user.username + " disconnected");
  });
}
