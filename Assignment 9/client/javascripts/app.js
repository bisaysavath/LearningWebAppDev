// Turn toDoObjects to be looked up by tags
var organizeByTags = function(toDoObjects) {
    "use strict";

    var newToDoObjects = [];
    var allTags = [];

    toDoObjects.forEach(function(object) {
        object.tags.forEach(function(tag) {
            if (allTags.indexOf(tag) === -1) {
                allTags.push(tag);
            }
        });
    });

    allTags.forEach(function(name) {
        var newObject = {};
        newObject.name = name;
        newObject.toDos = [];

        toDoObjects.forEach(function(object) {
            if (object.tags.indexOf(name) !== -1) {
                newObject.toDos.push(object.description);
            }
        });

        newToDoObjects.push(newObject);
    });

    return newToDoObjects;
};

// Grab only discriptions from toDoObjects
var mapToDos = function(toDoObjects) {
    "use strict";

    var toDos = toDoObjects.map(function(toDo) {
        return toDo.description;
    });

    return toDos;
};

function AppViewModel() {
    "use strict";

    var self = this;
    var toDoObjects;

    // Declare socket.io
    var socket = io();

    self.toDos = ko.observableArray([]);
    self.tabs = ko.observableArray([{
        name: "New",
        active: true
    }, {
        name: "Old",
        active: false
    }, {
        name: "Tags",
        active: false
    }, {
        name: "Add",
        active: false
    }]);
    self.tags = ko.observableArray([]);
    self.tagsVisibility = ko.observable(false);
    self.addVisibility = ko.observable(false);
    self.desInput = ko.observable();
    self.tagsInput = ko.observable();

    self.tabClick = function(item, event) {
        $(".tabs a span").removeClass("active");
        $(event.target).addClass("active");

        if (item.name === "New") {
            self.tags([]);
            self.tagsVisibility(false);
            self.addVisibility(false);
            self.toDos(mapToDos(toDoObjects));
        } else if (item.name === "Old") {
            self.tags([]);
            self.tagsVisibility(false);
            self.addVisibility(false);
            self.toDos(mapToDos(toDoObjects));
            var tempToDos = self.toDos();
            self.toDos(tempToDos.reverse());
        } else if (item.name === "Tags") {
            self.toDos([]);
            self.tagsVisibility(true);
            self.addVisibility(false);
            var tagsArray = [];

            organizeByTags(toDoObjects).forEach(function(tag) {

                var tagObject = {
                    tag: "",
                    des: []
                };

                tagObject.tag = tag.name;

                tag.toDos.forEach(function(description) {
                    tagObject.des.push(description);
                });

                tagsArray.push(tagObject);
            });

            self.tags(tagsArray);
        } else if (item.name === "Add") {
            self.tags([]);
            self.toDos([]);
            self.tagsVisibility(false);
            self.addVisibility(true);
        }
    };

    self.save = function() {
        var description = self.desInput();
        var tags = self.tagsInput().split(",");

        var newToDo = {
            "description": description,
            "tags": tags
        };

        $.ajax({
            type: "POST",
            url: "/todos",
            contentType: "application/json",
            data: JSON.stringify(newToDo),
            success: function() {
                // Emit "New Task" to server
                socket.emit("New Task", newToDo);

                toDoObjects.push(newToDo);

                self.desInput("");
                self.tagsInput("");
                console.log("We posted and the server responsed!");
            }
        }).fail(function(jqXHR, textStatus, error) {
            alert("There was a problem with posting. ERROR: " + error);
        });
    };

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("/todos.json", function(allData) {
        toDoObjects = allData;
        self.toDos(mapToDos(toDoObjects));
    });

    socket.on("New Task", function(updatedToDo) {
        toDoObjects.push(updatedToDo);
        self.toDos(mapToDos(toDoObjects));
    });
}

ko.applyBindings(new AppViewModel());