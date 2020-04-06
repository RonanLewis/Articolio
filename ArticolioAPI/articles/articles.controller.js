const userService = require('../users/user.service');
const express = require("express");
const router = express.Router();
const articleService = require("./article.service");
const authorize = require("_helpers/authorize");
const Role = require("_helpers/role");
const AllRoles = Object.values(Role);
const multer = require("multer");
const uuidv4 = require('uuid/v4');
const fs = require('fs');

// Multer File upload settings
const DIR = './public/images';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = ((uuidv4() + '-' + Date.now()).toLowerCase().split(' ').join('-') + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpeg_small") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Admin
router.delete("/:id", authorize(Role.Admin), _delete);
// User
router.get("/current", authorize(AllRoles), getAllByCurrent);
router.get("/:id", authorize(AllRoles), getById);
router.put("/:id", authorize(AllRoles), update);
router.get("/", getAll);
router.get("/name/:username", authorize(AllRoles), getByUsername)
router.post("/add", upload.single("image"), add);
router.post("/image/upload", upload.single("image"), imageUpload);
router.delete("/image/delete/:imagePath", authorize(AllRoles), imageDelete);

module.exports = router;
function add(req, res, next) {
  articleService
    .create(req)
    .then(() => res.json({}))
    .catch(err => next(err));
}
function imageUpload(req, res, next) {
  console.log(req.user);
  var usedImages = [];
  userService
    .getById(req.user.sub)
    .then(user => {
      if (user) {
        user.unusedImages.push(req.file.filename);
        console.log(user);
        userService.update(req.user.sub, user)
          .then(() => res.json(req.file))
          .catch(err => next(err));
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => next(err));
}
function imageDelete(req, res, next) {
  var images = JSON.parse(req.params.imagePath);
  userService
    .getById(req.user.sub)
    .then(user => {
      if (user) {
        for (var image in images) {
          if (user.unusedImages.includes(images[image])) {
            user.unusedImages.splice(user.unusedImages.indexOf(images[image]), 1);
          }
          images[image] = DIR + '/' + images[image];
        }
        console.log(user.unusedImages);
        userService.update(req.user.sub, user)
          .then(() => {
            console.log(images);
            articleService.deleteFiles(images, function (err) {
              if (err) {
                console.log(err);
                next(err);
              } else {
                console.log('all files removed');
                res.json(true);
              }
            });
          })
          .catch(err => next(err));
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => next(err));
}

function getAll(req, res, next) {
  articleService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getById(req, res, next) {
  const currentUser = req.user;
  const id = parseInt(req.params.id);
  console.log(id);
  articleService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getByUsername(req, res, next) {
  const currentUser = req.user;
  const username = req.params.username;

  articleService
    .getByUsername(username)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getAllByCurrent(req, res, next) {
  articleService
    .getByUsername(req.user.username)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function update(req, res, next) {
  articleService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function _delete(req, res, next) {
  articleService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}


