require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/error-handler");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use('/public', express.static(__dirname + "/public"));
app.use(jwt());
// api routes
app.use("/api/users", require("./users/users.controller"));
app.use("/api/articles", require("./articles/articles.controller"));
// Make Folder Publicly Available
// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === "production" ? 80 : 4000;
const server = app.listen(port, '0.0.0.0', function () {
  console.log("Server listening on port " + port);
});
