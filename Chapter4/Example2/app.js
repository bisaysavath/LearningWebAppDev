function AppViewModel() {
    "use strict";

    var self = this;

    self.comments = ko.observableArray([
        "This is the first comment!",
        "Here's the second one!",
        "And this is one more.",
        "Here is another one!"
    ]);

    self.newComment = ko.observable();

    self.addComment = function() {
        if (self.newComment !== "") {
            self.comments.push(self.newComment());
            self.newComment("");
        }
    };
}

ko.applyBindings(new AppViewModel());