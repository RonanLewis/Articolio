const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const authorize = require("_helpers/authorize");
const Role = require("_helpers/role");
const AllRoles = Object.values(Role);
// routes

// Admin
router.delete("/:id", authorize(Role.Admin), _delete);
// User
router.get("/current", getCurrent);
router.get("/:id", authorize(AllRoles), getById);
router.put("/:id", authorize(AllRoles), update);
router.get("/", authorize(AllRoles), getAll);
router.get("/name/:username", authorize(AllRoles), getByUsername)
//Public
router.post("/authenticate", authenticate);
router.post("/register", register);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}
function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getById(req, res, next) {
  const currentUser = req.user;
  const id = parseInt(req.params.id);
  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getByUsername(req, res, next) {
  const currentUser = req.user;
  const username = req.params.username;

  userService
    .getByUsername(username)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}
