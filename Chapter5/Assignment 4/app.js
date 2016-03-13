// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Billy Saysavath
var populatePage = function(url) {
    "use strict";

    // Class names for material design
    var mdlListItemClass = "mdl-list__item";
    var mdlPrimaryItemContentClass = "mdl-list__item-primary-content";
    var mdlAvatarClass = "material-icons mdl-list__item-avatar";
    var mdlSecondaryItemActionClass = "mdl-list__item-secondary-action";
    var mdlIconClass = "material-icons";

    $(".demo-list-action.mdl-list").empty();

    // Populate a list on index.html
    $.get(url, function(actor) {
        // Loop through info of each actor
        actor.forEach(function(actorInfo) {
            // Get a name and set star
            var $nameSpan = $("<span>").text(actorInfo.name);
            var $starIcon = $("<i>").attr("class", mdlIconClass).text(actorInfo.starred ? "star" : "star_border");

            // Declare neccessary tags with class
            var $div = $("<div>").attr("class", mdlListItemClass).hide();
            var $span = $("<span>").attr("class", mdlPrimaryItemContentClass);
            var $avatar = $("<i>").attr("class", mdlAvatarClass).text("person");
            var $action = $("<a>").attr({
                "class": mdlSecondaryItemActionClass,
                "href": "#"
            });


            // Assign click function on each star
            $action.on("click", function() {
                var newActorInfo = actorInfo;
                newActorInfo.starred = !newActorInfo.starred;

                $.ajax({
                    url: url + "/" + actorInfo.id,
                    type: "PUT",
                    data: newActorInfo,
                    dataType: "json",
                    success: function() {
                        populatePage(url);
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            });

            // Append in order
            $span.append($avatar, $nameSpan);
            $action.append($starIcon);

            $div.append($span, $action);
            $("main .demo-list-action.mdl-list").append($div);
            $div.fadeIn();
        });
    });
};

var addNewActor = function(url) {
    "use strict";

    var newActorInfo = {
        "name": $("#newActorName").val(),
        "starred": false
    };

    $.post(url, newActorInfo);
};

var main = function() {
    "use strict";

    // Actor database location
    var JSON_ACTOR_URL = "http://localhost:3000/actors";

    populatePage(JSON_ACTOR_URL);

    // Add actor on click and enter
    $("#addActor").on("click", function() {
        console.log("click");
        if ($("#newActorName").val() !== "") {
            addNewActor(JSON_ACTOR_URL);
        }
    });
};

$(document).ready(main);
