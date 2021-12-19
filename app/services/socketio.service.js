const db = require("../models");
const jwt = require("jsonwebtoken");

const socketIO = {};

socketIO.init = (http, corsOptions) => {
  socketIO.io = require("socket.io")(http, {
    cors: corsOptions,
  });

  socketIO.io.on("connection", (socket) => {
    authenticate(socketIO.io, socket);
  });
};

socketIO.sendToUser = (userId, event, data) => {
  userId = parseInt(userId);
  socketIO.io.sockets.sockets.forEach(socket => {
    if(socket.user && socket.user.id === userId) {
      socket.emit(event, data);
    }
  });
}

async function authenticate(io, socket) {
  try {
    let token = socket.handshake.auth.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const decodedUser = decodedToken.user;
  
    // Update lastseenAt attribute of current user
    let user = await db.User.findByPk(decodedUser.userId);
    if(user == null)
      throw new Error("User not found")
    socket.user = user;
  
    console.log("[SocketIO] User " + user.username + " connected with token " + token);
    await listenEvents(io, socket);
  }
  catch(error) {
    console.log("[SocketIO] Error on authenticating user:", error);
    socket.disconnect();
  }
}

async function listenEvents(io, socket) {
  socket.on("disconnect", () => {
    console.log("[SocketIO] User " + socket.user.username + " disconnected");
  });
}

module.exports = socketIO;