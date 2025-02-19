﻿const config = require("config.json");
const jwt = require("jsonwebtoken");
const db = require("_helpers/db");
const User = db.User;
const bcrypt = require("bcryptjs");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  getByUsername,
  delete: _delete
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    const { hash, ...userWithoutHash } = user.toObject();
    return {
      ...userWithoutHash,
      token
    };
  }
}

async function getAll() {
  return await User.find().select("-hash");
}

async function getById(id) {
  return await User.findById(id).select("-hash");
}

async function getByUsername(username) {
  return await User.findOne({ username: username }).select("-hash");
}

async function create(userParam) {
  // validate
  console.log(userParam);
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  var user = new User(userParam);
  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }
  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
