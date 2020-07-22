var express = require("express");
var path = require("path");
var database = require("./db/db.json");
var fs = require("fs");


var server = express();
var PORT = process.env.PORT || 3000;

server.use(express.urlencoded({ extended: true}));
server.use(express.json());
server.use("/assets", express.static(__dirname + "/assets"));

const tasks = database;

server.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));

});

server.get("/api/notes", function(req, res) {
    console.log("This thing working?");
    return res.json(tasks);
});

server.post("/api/notes", function(req, res) {
    var newInfo = req.body;
    console.log(newInfo + " is gay");

    let topNote = 0;
    for (let key in tasks) {
        let id = tasks
    }

});

server.delete("/api/notes", function(req, res) {
    
    var deletedNote = parseInt(req.params.id);
    
    var result = tasks.filter(({id}) => id !== deletedNote);
    notes = result;

    fs.writeFile("db/db.json", "utf8", function(err) {
        if (err) {
            console.log(err)
        }

        console.log("Deleted a Task");
        res.json(notes)

    })
});





// Default Fallback
server.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"))
});

// Start the server
server.listen(PORT, function() {
    console.log("Server is now starting on PORT " + PORT)
});