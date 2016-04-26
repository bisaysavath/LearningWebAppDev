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

var main = function(toDoObjects) {
    "use strict";

    // Declare socket.io
    var socket = io();

    // toDos holds only descriptions
    var toDos = mapToDos(toDoObjects);

    // Getting a "New Task" event
    socket.on("New Task", function(updatedToDo) {
        toDoObjects.push(updatedToDo);
        toDos = mapToDos(toDoObjects);
        $(".tabs a span.active").trigger("click");
    });

    // Organize tabs into an array of objects
    // create an empty array of tabs
    var tabs = [];

    // Newest
    tabs.push({
        "name": "Newest",
        "content": function() {
            // newest first, so we have to go through
            // the array backwards
            var $content = $("<ul>");
            for (var i = toDos.length - 1; i >= 0; i--) {
                $content.append($("<li>").text(toDos[i]));
            }

            return $content;
        }
    });

    // Oldest
    tabs.push({
        "name": "Oldest",
        "content": function() {
            // oldest first, so we go through the array normally
            var $content = $("<ul>");
            toDos.forEach(function(todo) {
                $content.append($("<li>").text(todo));
            });

            return $content;
        }
    });

    // Tags
    tabs.push({
        "name": "Tags",
        "content": function() {
            var $mainContent = $("main .content");
            // show with tags
            organizeByTags(toDoObjects).forEach(function(tag) {
                var $h3TagName = $("<h3>").text(tag.name);
                var $ulDescription = $("<ul>");

                tag.toDos.forEach(function(description) {
                    var $li = $("<li>").text(description);
                    $ulDescription.append($li);
                });

                $mainContent.append($h3TagName);
                $mainContent.append($ulDescription);
            });

            return null;
        }
    });

    // Add
    tabs.push({
        "name": "Add",
        "content": function() {
            var $content;

            // input a new to-do
            var $button = $("<button>").text("+");

            var $desInput = $("<input>");
            var $tagsInput = $("<input>");
            var $desTitle = $("<h2>").text("Description:");
            var $tagsTitle = $("<h2>").text("Tags:");

            $button.on("click", function() {
                var description = $desInput.val();
                var tags = $tagsInput.val().split(",");
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

                        // Reload toDos with description
                        toDos = mapToDos(toDoObjects);

                        $desInput.val("");
                        $tagsInput.val("");
                        console.log("We posted and the server responsed!");
                    }
                }).fail(function(jqXHR, textStatus, error) {
                    alert("There was a problem with posting. ERROR: " + error);
                });
            });

            $content = $("<div>").append($desTitle, $desInput, $tagsTitle, $tagsInput, $button);

            return $content;
        }
    });

    // Populate tabs div
    tabs.forEach(function(tab) {
        var $aElement = $("<a>").attr("href", ""),
            $spanElement = $("<span>").text(tab.name);

        $aElement.append($spanElement);

        $spanElement.on("click", function() {
            var $content;

            $(".tabs a span").removeClass("active");
            $spanElement.addClass("active");
            $("main .content").empty();

            $content = tab.content;
            $("main .content").append($content);

            return false;
        });

        $("main .tabs").append($aElement);
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function() {
    "use strict";

    $.get("/todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});