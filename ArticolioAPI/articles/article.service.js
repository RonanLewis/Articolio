const db = require("_helpers/db");
const Article = db.Article;
const fs = require('fs');

module.exports = {
  getAll,
  getById,
  create,
  update,
  getByUsername,
  delete: _delete,
  deleteFiles: _deleteFiles
};
function _deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function (filepath) {
    fs.unlink(filepath, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}
async function getAll() {
  return await Article.find();
}

async function getById(id) {
  return await Article.findById(id);
}

async function getByUsername(username) {
  return await Article.find({ createdBy: username });
}

async function create(req) {
  var articleParam = req.body;
  var today = Date.now();

  var article = new Article(articleParam);
  if (article.tags[0] == "null") {
    article.tags = [];
  }
  article.image = {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
  };
  if (await Article.findOne({ createdBy: articleParam.createdBy, title: articleParam.title })) {
    throw "You already have an article with this name"
  }

  article.lastUpdated.push(today);
  article.createdDate = today;
  await article.save();
}

async function update(id, articleParam) {
  const article = await Article.findById(id);

  // validate
  if (!article) throw "User not found";
  if (
    article.createdBy !== articleParam.createdBy &&
    (await Article.findOne({ createdBy: articleParam.createdBy }))
  ) {
    throw 'Cannot update an article that you did not write.';
  }
  const createdDate = article.createdDate;
  // copy articleParam properties to user
  Object.assign(article, articleParam);
  article.createdDate = createdDate;
  article.lastUpdated.push(Date.now);
  await article.save();
}

async function _delete(id) {
  await Article.findByIdAndRemove(id);
}
