var express = require("express");
var path = require("path");
var database = require("./db/db.json");
var fs = require("fs");
// WHY DOES THIS LINE KEEP SHOWING UP!
const { isBuffer } = require("util");

// Assigning the server to a variable
var server = express();
// Declaring the Port to be used
var PORT = process.env.PORT || 3000;

server.use(express.urlencoded({ extended: true}));
server.use(express.json());
// Allows the server access to all the assets like CSS and Javascript
server.use("/assets", express.static(__dirname + "/assets"));

// Assigning the Variable of task to the Database Array that has been imported
var tasks = database;

// This get request serves the client with the Notes.html page when /notes is requested
server.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});
// This get Handler serves the user with the Database entries
server.get("/api/notes", function(req, res) {
    console.log("This thing working?");
    return res.json(tasks);
});
// This get handler serves the client with the information of the Tasks when clicked on
server.get("/api/notes:id", function(req, res) {
    var addedNote = parseInt(req.params.id);
    // this for loop checks for the key given as a parater and finds the object.
    for (let key in notes) {
        let {id, title, text} = tasks[key];
        // once a match is found the server responds with the provided info
        // it creates a new object with the infomation from the database and gives the newly created object to the client
        if (id === addedNote) {
            res.json({"id": id, "title": title, "text": text});
        }
    }
})
// This handler adds a key to the new entry then pushes it to an array, that array then overwrites the db.json file
server.post("/api/notes", function(req, res) {
    var newInfo = req.body;
    console.log(newInfo + " is gay");
    // for every entry in the object of tasks, assign a value
    let topNote = 0;
    for (let key in tasks) {
        let id = tasks[key].id;
        if (id > topNote) {
            topNote = id;
        }
    }
    // Assigning the new Task that is to be entered with an ID
    newInfo.id = topNote + 1;
    tasks.push(newInfo);

    // Writing the updated tasks object to the db.json file.
    fs.writeFile("db/db.json", JSON.stringify(tasks), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("Adding Task to Database");
        res.json(newInfo);
    });
});
// This listener handles the Delete requests, accepts a parameter of the task that is to be deleted
server.delete("/api/notes/:id", function(req, res) {
    // assigning a variable to the parametered request
    var deletedNote = parseInt(req.params.id);
    // result will have the object that matches id with the task that is to be deleted, it is then filter out of the database
    var result = tasks.filter(({id}) => id !== deletedNote);
    // setting the value of tasks to the filtered result without the deleted task
    tasks = result;

    // Overwriting the db.json with the new filtered array of objects
    fs.writeFile("db/db.json", JSON.stringify(tasks), function(err) {
        if (err) {
            console.log(err)
        }
        console.log("Deleted a Task");
        res.json(tasks)
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