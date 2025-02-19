const mongoose = require("mongoose");
const Role = require("_helpers/role");

const Schema = mongoose.Schema;
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  unusedImages: { type: [String], default: [] },
  role: { type: String, default: Role.User }
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
