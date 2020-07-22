var express = require("express");
var path = require("path");
var database = require("./db/db.json");
var fs = require("fs");
const { isBuffer } = require("util");


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


server.get("/api/notes:id", function(req, res) {
    var addedNote = parseInt(req.params.id);

    for (let key in notes) {
        let {id, title, text} = tasks[key];

        if (id === addedNote) {
            res.json({"id": id, "title": title, "text": text});
        }
    }
})




server.post("/api/notes", function(req, res) {
    var newInfo = req.body;
    console.log(newInfo + " is gay");

    let topNote = 0;
    for (let key in tasks) {
        let id = tasks[key].id;
        if (id > topNote) {
            topNote = id;
        }
    }

    newInfo.id = topNote + 1;
    tasks.push(newInfo);


    fs.writeFile("db/db.json", JSON.stringify(tasks), function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("Adding Task to Database");
        res.json(newInfo);

    });


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