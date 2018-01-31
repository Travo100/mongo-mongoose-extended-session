var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;


if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useMongoClient: true
    });
} else {
    mongoose.connect("mongodb://localhost/sessionDB", {
        useMongoClient: true
    });
}

// Routes
app.get("/", function(req, res) {
    db.Student.find().then(function(data){
        
        res.render("students", {student: data});
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/student/:id", function(req, res) {
    db.Student.findById(req.params.id).then(function(data){
        res.render("student", data);
    }).catch(function(err){
        res.json(err);
    });
});

app.post("/api/student", function(req, res){
    console.log(req.body);
    db.Student.create(req.body).then(function(data){
        res.redirect("/");
    }).catch(function(err){
        res.json(err);
    });
});

app.post("/api/student/update", function(req, res){
    
    // need to use JSON.parse here to get the string of "false" or "true" and make it boolean false or true
    var isHonorRoll = (JSON.parse(req.body.isHonorRoll)) ? false : true; 
    
    db.Student.findByIdAndUpdate(req.body.id, {
        $set: {
            "isHonorRoll": isHonorRoll
        }
    }).then(function(data){
        res.redirect("/");
    }).catch(function(err){
        res.json(err);
    });
});

app.post("/api/student/delete", function(req, res){
    db.Student.findByIdAndRemove(req.body.id).then(function(data){
        res.redirect("/");
    }).catch(function(err){
        res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
