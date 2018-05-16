var db = require("../database/db");
let Book = require("../models/BookModel");
var fs = require("fs");
var path = require("path");
var hbs = require("handlebars");

var image = require("./Image");
let mediaPath = "../";
var partialsPath = path.join(__dirname, "../views/partials");
let info = {
  email: "info@kikibook.com",
  number: "1900000000"
};

var filenames = fs.readdirSync(partialsPath);
filenames.forEach(filename => {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsPath + "/" + filename, "utf8");
  hbs.registerPartial(name, template);
});

class Controller {
  constructor() {}
  renderHome(req, res) {
    let data = {
      title: "KiKi Bookstore",
      info: info,
      scripts: ["index.js"]
    };
    res.render("index", data);
  }

  renderDetail(req, res) {
    let id = "";
    if (req.query.id != undefined) id = req.query.id;
    db.LoadBook(id, book =>{
      if(book.image[0] === ''){
          book.image[0] = '/api/media?name=null.jpg'
      }
      res.render("detail", {
        title: book.name,
        info: info,
        item: book,
        finalPrice: book.price*book.deal/100,
        scripts:['detail.js']
      })}
    );
  }

  getBookContent(req, res) {
    let offset = 0;
    let limit = 10;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);

    res.setHeader("Content-Type", "text/html");
    fs.readFile(
      path.join(__dirname, "../views/partials", "Content.hbs"),
      "utf8",
      (err, data) => {
        let code = hbs.compile(data);
        db.LoadBooks(0, 2, books => {
          let setData = {
            name: "Danh sách",
            items: books
          };
          res.send(code(setData));
        });
      }
    );
  }

  getBookTypeContent(req, res) {
    let offset = 0;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    res.setHeader("Content-Type", "text/html");
    let code = hbs.compile(`{{>MenuList }}`);
    db.LoadBookTypes(offset, limit, type => {
      res.send(code({ booktypes: type }));
    });
  }

  getAllBookCategory(req, res) {
    let offset = 0;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    db.LoadAllTypes(cursor => {
      let num = 0;
      cursor.on("data", doc => {
        db.LoadBooksCategory(offset, limit, doc._id, (books, undefined) => {
          var code = hbs.compile(`{{>Content }}`);
          let html = code({
            name: doc.name,
            items: books
          });
          html = html.replace(/[\t\r\n]/g, "");
          res.sse(`data: <div>${html}</div>\n\n`);
        });
      });
    });
  }

  getBook(req, res) {
    let offset = 0;
    let limit = 10;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);

    let Books = Array();
    db.LoadAllTypes(cursor => {
      let num = 0;
      cursor.on("data", doc => {
        db.LoadBooksCategory(offset, limit, doc._id, (books, undefined) => {
          var code = hbs.compile(`{{>Content }}`);
          let html = code({
            name: doc.name,
            items: books
          });
          html = html.replace(/[\t\r\n]/g, "");
          res.sse(`data: <div>${html}</div>\n\n`);
        });
      });
    });
  }

  getBookType(req, res) {
    let offset = 0;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);

    db.LoadBookTypes(offset, limit, booktypes => {
      res.send(JSON.stringify(booktypes));
    });
  }

  getImage(req, res) {
    let name = "null.jpg";
    if (req.query.name != undefined) name = req.query.name;
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(path.join(__dirname, "../media", name));
  }

  test(req, res) {
    db.LoadAllTypes(cursor => {
      let num = 0;
      cursor.on("data", doc => {
        db.LoadBooksCategory(0, 3, doc._id, (books, undefined) => {
          var code = hbs.compile(`{{>Content }}`);
          let html = code({
            name: doc.name,
            items: books
          });
          html = html.replace(/[\t\r\n]/g, "");
          res.sse(`data: <div>${html}</div>\n\n`);
        });
      });
    });
  }

  renderCategory(req, res) {
    let offset = 0;
    let limit = 10;
    let type = undefined;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    if (req.query.type != undefined) type = req.query.type;
    if (type === undefined) {
      let data = {
        title: "Kiki Bookstore",
        info: info,
        scripts: ["category.js"]
      };
      res.render("index", data);
    } else {
      db.LoadBooksCategory(offset, limit, type, (books, name) => {
        let data = {
          title: name.toUpperCase(),
          info: info,
          category: name.toUpperCase(),
          items: books
        };
        res.render("category", data);
      });
    }
  }
}

module.exports = new Controller();
