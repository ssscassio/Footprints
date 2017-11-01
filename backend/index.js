var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");

app.set("port", process.env.PORT || 3000);

footprints: footprintspassword;
var connection = mysql.createConnection({
  host: "mysql857.umbler.com",
  user: "footprints",
  password: "footprintspassword",
  database: "footprints-db"
});

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "footprints-db"
// });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.send("Hello Footprints !");
});

app.post("/addUser", function(req, res) {
  let firebaseId = req.body.firebaseid;
  if (!firebaseId) {
    res.send({ Error: "No firebase id found in body request" });
  }

  let user = { firebase_id: firebaseId };
  connection.query("INSERT INTO users SET ?", user, function(
    error,
    results,
    fields
  ) {
    if (error) {
      res.send({ error: error.code });
    }
  });

  res.send(req.body);
});

app.listen(app.get("port"), function() {
  console.log("Footprints listening on port ", app.get("port"));
});
