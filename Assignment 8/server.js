var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    ToDosController = require("./controllers/todos_controller.js"),
    SocketController = require("./controllers/socket_controller.js"),
    port = process.env.PORT || 3000,
    mongoUrl = process.env.MONGODB_URI || "mongodb://localhost/amazerific";

// set static directory route
app.use(express.static(__dirname + "/client"));

// parse application/json
app.use(bodyParser.json());

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(mongoUrl, function(err) {
    "use strict";

    if (err) {
        console.log("ERROR connecting to: " + mongoUrl + ". " + err);
    } else {
        console.log("Succeeded connected to: " + mongoUrl);
    }
});

// Create a http server
http.listen(port, function(err) {
    "use strict";

    if (err) {
        console.log("ERROR creating SERVER." + err);
    } else {
        console.log("Server is listening on: " + port);
    }
});

// have socket.io listen to http
SocketController.connect(http);

// routes
app.get("/todos.json", ToDosController.index);

//basic CRUD routes
app.get("/todos/:id", ToDosController.show);
app.post("/todos", ToDosController.create);