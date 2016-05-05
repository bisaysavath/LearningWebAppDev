var SocketController = {};

SocketController.connect = function(http) {
    "use strict";

    var io = require("socket.io")(http);

    io.on("connection", function(socket) {

        socket.on("New Task", function(obj) {
            socket.broadcast.emit("New Task", obj);
        });
    });
};

module.exports = SocketController;