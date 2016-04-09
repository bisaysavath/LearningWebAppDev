var express = require("express"),
    bodyParser = require("body-parser"),
    redis = require("redis"),
    app = express(),
    redisClient,
    stats = {
        "wins": null,
        "losses": null
    };

var retrieveStats = function(callback) {
    "use strict";

    redisClient.mget(["wins", "losses"], function(err, results) {
        if (err !== null) {
            console.log("ERROR: " + err);
            return;
        }

        stats.wins = parseInt(results[0], 10) || 0;
        stats.losses = parseInt(results[1], 10) || 0;

        if (callback) {
            callback();
        }
    });
};

// Connect to Redis client
redisClient = redis.createClient();

// Retrieve stats from Redis database
retrieveStats(function() {});

// parse application/json
app.use(bodyParser.json());

// http.createServer(app).listen(3000);
app.listen(3000);
console.log("Server is listening at 3000");

app.post("/flip", function(req, res) {
    "use strict";

    var receivedData = req.body;
    var coinOutcomes = ["heads", "tails"];
    //Credit: http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
    var flipResult = coinOutcomes[Math.floor(Math.random() * coinOutcomes.length)];
    console.log("Flip result: " + flipResult);
    console.log("Call result: " + receivedData.data);

    var result;
    if (flipResult === receivedData.data) {
        result = "win";
        stats.wins = stats.wins + 1;
        redisClient.incr("wins");
        console.log(result);
    } else {
        result = "lose";
        stats.losses = stats.losses + 1;
        redisClient.incr("losses");
        console.log(result);
    }

    res.json({
        "result": result
    });
});

app.get("/stats", function(req, res) {
    "use strict";
    res.json(stats);
});

app.delete("/stats", function(req, res) {
    "use strict";

    redisClient.flushall(function() {
        retrieveStats(function() {
            res.json({
                "Message": "Reset completed",
                "stats": stats
            });
        });
    });
});

// curl --silent --request POST --header 'Content-Type:application/json' --data '{"data":"heads"}' 'http://localhost:3000/flip' | python -m json.tool
// curl --silent --request POST --header 'Content-Type:application/json' --data '{"data":"tails"}' 'http://localhost:3000/flip' | python -m json.tool
// curl --silent --request GET --header 'Content-Type:application/json' 'http://localhost:3000/stats' | python -m json.tool
// curl --silent --request DELETE --header 'Content-Type:application/json' 'http://localhost:3000/stats' | python -m json.tool