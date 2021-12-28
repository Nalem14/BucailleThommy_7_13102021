const db = require("../models");
const jwt = require("jsonwebtoken");

const socketIO = {};

// Init socketIO
socketIO.init = (http, corsOptions) => {
  socketIO.io = require("socket.io")(http, {
    cors: corsOptions,
  });

  socketIO.io.on("connection", (socket) => {
    authenticate(socket);
  });
};

/**
 * Emit an event to specific user by id
 * @param {*} userId 
 * @param {*} event 
 * @param {*} data 
 */
socketIO.sendToUser = (userId, event, data) => {
  userId = parseInt(userId);
  socketIO.io.sockets.sockets.forEach(socket => {
    if(socket.user && socket.user.id === userId) {
      socket.emit(event, data);
    }
  });
}


async function authenticate(socket) {
  try {
    let token = socket.handshake.auth.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const decodedUser = decodedToken.user;
  
    // Get the user data in DB
    let user = await db.User.findByPk(decodedUser.userId);
    if(user == null)
      throw new Error("User not found")

    // Save the user object in the socket
    socket.user = user;
  
    // Listen to events for this socket
    listen(socket);

  }
  catch(error) {
    console.log("[SocketIO] Error on authenticating user:", error);
    socket.disconnect();
  }
}


function listen(socket) {
  console.log("[SocketIO] User " + socket.user.username + " connected");
  socket.on("disconnect", () => {
    console.log("[SocketIO] User " + socket.user.username + " disconnected");
  });


  socket.on("message:seen", ({from, to}) => {
    socketIO.sendToUser(to, "message:seen", from);
  })
}

module.exports = socketIO;