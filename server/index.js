"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
// const dev = process.env.NODE_ENV == "development";
var port = 3000;
app.get("/env", function (req, res) {
  res.json({
    environment: process.env.NODE_ENV,
  });
});
app.get("/db-env", function (req, res) {
  res.json({
    "db-host": process.env.DB_HOST,
  });
});
app.use(express.static("dist"));
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
