const mongoose = require("mongoose");
const Role = require("_helpers/role");

const Schema = mongoose.Schema;
const schema = new Schema({
  title: { type: String, required: true },
  contentText: { type: String, required: true },
  contentHTML: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  lastUpdated: { type: [Date], default: [] },
  image: {
    fieldname: { type: String, default: 'placeholder-360' },
    originalname: { type: String, default: 'placeholder-360.png' },
    encoding: { type: String, default: '7bit' },
    mimetype: { type: String, default: 'image/png' },
    filename: { type: String, default: 'placeholder-360.png' },
    path: { type: String, default: 'public\\images\\374ddd9f-19dd-4c21-a889-dc1795a0387b-1585664880805.png' },
    size: { type: Number, default: 907 },
  },
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Article", schema);
