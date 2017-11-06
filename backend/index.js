var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");

app.set("port", process.env.PORT || 3000);

// footprints: footprintspassword;
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

/**
 * Request example:
 * http://footprintsapp-xxx.umbler.net/addUser
 * @param
 * firebaseId: user firebase id
 */
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
      res.send({ error: error });
    }
  });

  let respose = {
    status: "ok",
    code: 201,
    message: "Usuário adicionado com sucesso"
  };

  res.send(respose);
});

/**
 * Request example:
 * http://footprintsapp-xxx.umbler.net/addFriend
 * @param
 * inviter: FirebaseID of the user who is inviting to create the friendship
 * reciever: FirebaseID of the user who is being invited to the friendship
 */
app.post("/addFriend", function(req, res) {
  let inviterFId = req.body.inviter;
  let recieverFId = req.body.reciever;

  let friendship = {
    inviter: inviterFId,
    reciever: recieverFId,
    status: false
  };

  connection.query("INSERT INTO friends SET ?", friendship, function(
    error,
    results,
    fields
  ) {
    if (error) {
      res.send({ error: error });
    }
  });

  let respose = {
    status: "ok",
    code: 201,
    message: "Amizade criada com sucesso"
  };

  res.send(respose);
});

/**
 * Request example:
 * http://footprintsapp-xxx.umbler.net/addFriend
 * @param
 * inviter: FirebaseID of the user who is inviting to create the friendship
 * reciever: FirebaseID of the user who is being invited to the friendship
 * status: Status of the friendship, if true, accepts the invite, if false, 
 * removes the friendship invitation
 */
app.post("/updateFriendship", function(req, res) {
  let inviterFId = req.body.inviter;
  let recieverFId = req.body.reciever;
  let statusReq = req.body.status;
  let status = statusReq == "true";

  connection.query(
    "SELECT * FROM friends WHERE inviter = ? AND reciever = ?",
    [inviterFId, recieverFId],
    function(error, results, fields) {
      if (results.length > 0) {
        if (status) {
          let id = results[0].id;
          connection.query(
            "UPDATE friends SET status = ? WHERE id = ?",
            [status, id],
            function(error, results, fields) {
              if (error) {
                res.send({ error: error });
              } else {
                let response = {
                  status: "ok",
                  code: 200,
                  message: "Amizade aceita"
                };
                res.send(response);
              }
            }
          );
        } else {
          let id = results[0].id;
          connection.query("DELETE FROM friends WHERE id = ?", [id], function(
            error,
            results,
            fields
          ) {
            if (error) {
              res.send({ error: error });
            } else {
              let response = {
                status: "ok",
                code: 200,
                message: "Amizade desfeita"
              };
              res.send(response);
            }
          });
        }
      }
    }
  );
});

app.listen(app.get("port"), function() {
  console.log("Footprints listening on port ", app.get("port"));
});
