var ToDo = require("../models/todo.js"),
    ToDosController = {};

ToDosController.index = function(req, res) {
    "use strict";

    ToDo.find({}).exec(function(err, toDos) {
        if (err !== null) {
            console.log(err);
            res.json(err);
        } else {
            res.json(toDos);
        }
    });
};

ToDosController.create = function(req, res) {
    "use strict";

    var newToDo = new ToDo({
        "description": req.body.description,
        "tags": req.body.tags
    });

    newToDo.save(function(err, result) {
        console.log(result);
        if (err !== null) {
            console.log(err);
            res.json(err);
        } else {
            res.json(result);
        }
    });
};

ToDosController.show = function(req, res) {
    "use strict";

    var id = req.params.id;

    ToDo.find({
        "_id": id
    }, function(err, todo) {
        if (err !== null) {
            res.json(err);
        } else {
            if (todo.length > 0) {
                res.json(todo[0]);
            } else {
                res.send("Not found");
            }
        }
    });
};

module.exports = ToDosController;