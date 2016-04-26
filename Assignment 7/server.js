var express = require("express"),
    bodyParser = require("body-parser"),
    mongodb = require("mongodb"),
    app = express(),
    port = process.env.PORT,
    service,
    mongoClient;

// Set up Mongo DB and collection
mongoClient = mongodb.MongoClient;
service = JSON.parse(process.env.VCAP_SERVICES);
mongoClient.connect(services.mongolab[0].credentials.uri, function(err, db) {
    "use strict";

    if (err !== null) {
        console.log("ERROR: " + err);
        return;
    }

    console.log("Connected to MongoDB");
    var linksCol = db.collection("links");

    // Parse application/json
    app.use(bodyParser.json());

    // Set default route
    app.use(express.static(__dirname + "/Client"));

    // Set up express server to listen
    app.listen(3000);
    console.log("Server is listening at port: 3000");

    app.get("/links", function(req, res) {
        linksCol.find({}, {
            _id: 0
        }).toArray(function(err, docs) {
            if (err !== null) {
                console.log("ERROR: " + err);
                res.send("ERROR: " + err);
            } else {
                console.log("Database loaded successfully");
                res.send(docs);
            }
        });
    });

    app.post("/links", function(req, res) {
        var link = req.body;

        link.clicks = 0;
        linksCol.save(link, function(err) {
            if (err !== null) {
                console.log("ERROR: " + err);
                res.send("ERROR: " + err);
            } else {
                console.log("Saved to DB successfully");
                res.send("Saved to DB successfully");
            }
        });
    });

    app.get("/click:title", function(req, res) {
        var title = req.params.title;

        linksCol.updateOne({
            "title": title
        }, {
            $inc: {
                "clicks": 1
            }
        });

        var cursor = linksCol.find({
            "title": title
        });
        cursor.each(function(err, doc) {

            if (err === null && doc !== null) {
                console.log("Found link");
                res.send(doc.link);
            }

        });
    });

    app.delete("/links", function(req, res) {
        linksCol.remove({}, function(err) {
            if (err !== null) {
                console.log("ERROR: " + err);
                res.send("ERROR: " + err);
            } else {
                console.log("Database reset successfully");
                res.send("Database reset successfully");
            }
        });
    });
});
