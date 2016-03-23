var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    stats = {
        "wins": 0,
        "losses": 0
    };

// parse application/json
app.use(bodyParser.json());

// http.createServer(app).listen(3000);
app.listen(3000);
console.log("Server is listening at 3000");

app.post("/flip", function(req, res) {
    "use strict";

    var newCall = req.body;
    var coinOutcomes = ["heads", "tails"];
    //Credit: http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
    var flipResult = coinOutcomes[Math.floor(Math.random() * coinOutcomes.length)];
    console.log(flipResult);

    var result;
    if (flipResult === newCall.call) {
        result = "win";
        stats.wins = stats.wins + 1;
    } else {
        result = "lose";
        stats.losses = stats.losses + 1;
    }

    res.json({
        "result": result
    });
});

app.get("/stats", function(req, res) {
    "use strict";
    res.json(stats);
});