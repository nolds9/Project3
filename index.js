var express = require('express');
var app = express();
var citiesController = require("./controllers/cities")
// var helpers = require("../helpers/helper")
var path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.set("view engine", "hbs");

app.get("/", citiesController.index)

app.use(express.static(path.join(__dirname, "/public")));
// app.use("/cities", require("./controllers/cities"));

app.listen(4000, function(){
    console.log("app listening on port 4000");
    // helpers.someHelper()
});
