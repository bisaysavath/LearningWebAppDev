var main = function() {
    "use strict";

    $("#get-links").on("click", function() {
        $.get("/links", function(response) {
            $("pre").empty();
            var docs = JSON.stringify(response, null, 4);
            $("pre").append(docs);
        });
    });

    $("#post-links").on("click", function() {
        var newTitle = $("#title").val();
        var newLink = $("#new-link").val();

        if (newTitle !== "" && newLink !== "") {
            console.log(newTitle);
            console.log(newLink);

            $("#title").val("");
            $("#new-link").val("");

            var newLinkJSON = {
                "title": newTitle,
                "link": newLink
            };

            $.ajax({
                type: "post",
                url: "/links",
                contentType: "application/json",
                data: JSON.stringify(newLinkJSON),
                success: function(response) {
                    console.log("Result: " + response);
                }
            });
        } else {
            console.log("Missing a title or a link");
        }
    });

    $("#click-title").on("click", function() {
        var link = $("#link").val();

        if (link !== "") {
            var url = "/click" + link;

            $.get(url, function(response) {
                console.log("1" + response);
                if (response !== "") {
                    $("#link").val("");
                    window.location.href = response;
                }
            });
        } else {
            console.log("Missing a link");
        }
    });

    $("#reset-db").on("click", function() {
        $.ajax({
            type: "delete",
            url: "/links",
            contentType: "application/json",
            success: function(response) {
                console.log("Result: " + response);
            }
        });
    });
};

$(document).ready(main);