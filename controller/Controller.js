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

  getBookCount(){
    return new Promise((resolve, reject) => {
      resolve()
    }).then(db.LoadCountBook)
  }

  getBookContent(req, res) {
    let offset = 1;
    let limit = 10;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    let code = hbs.compile(`{{>Content }}`);
    res.setHeader("Content-Type", "text/html");
    db.LoadBooks(1, 2, books => {
      let setData = {
        name: "Danh sách",
        items: books
      };
      res.send(code(setData));
    });
  }

  getBookTypeContent(req, res) {
    let offset = 1;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    res.setHeader("Content-Type", "text/html");
    let code = hbs.compile(`{{>MenuList }}`);
    db.LoadBookTypes(offset, limit).then( type => {
      res.send(code({ booktypes: type }));
    });
  }

  getAllBookCategory(req, res) {
    let offset = 1;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);
    db.LoadAllTypes().then(cursor => {
      let num = 0;
      cursor.on("data", doc => {
        db.LoadBooksCategory(offset, limit, doc._id)
        .then((result) => {
          var code = hbs.compile(`{{>Content }}`);
          let html = code({
            name: doc.name,
            items: result.Books
          });
          html = html.replace(/[\t\r\n]/g, "");
          res.sse(`data: <div>${html}</div>\n\n`);
        })
      });
    })
  }

  getBook(req, res) {
    let offset = 1;
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
    let offset = 1;
    let limit = 6;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.limit != undefined) limit = parseInt(req.query.limit);

    db.LoadBookTypes(offset, limit).then(booktypes => {
      res.send(JSON.stringify(booktypes));
    })
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
        db.LoadBooksCategory(1, 3, doc._id, (books, undefined) => {
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
    let offset = 1;
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
      let count;
      db.LoadCountByCategory(type).then((result) => {
        count = result;
      })
      .then(() =>{
        return db.LoadBooksCategory(offset, limit, type,null);
      })
      .then((result) => {
        let start = Math.floor(offset / 7) * 7 == 0 ? 1 : Math.floor(offset / 7) * 7;
        let end = start == 1 ? start + 6 : start + 7;
        let max = Math.floor(count / limit) == 0 ? 1 : Math.floor(count / limit);
        end = end > max ? max : start + 6;
        let page = [];
        for(var i = start; i <= end;++i){
          let disabled = "";
          if(i == offset) disabled = "disabled";
          page.push({text: i,url: `category?offset=${i}&limit=${limit}&type=${type}`,disabled: disabled});
        }
        let data = {
          title: result.Name.toUpperCase(),
          info: info,
          category: result.Name.toUpperCase(),
          items: result.Books,
          //scripts: ["category.js"],
          itemsPage: page
        };
        res.render("category", data);
      }
    )
    }
  }

  getLogin(req, res) {
    let username = "";
    let password = "";
    if (req.query.username != undefined) username = req.query.username;
    if (req.query.password != undefined) password = req.query.password;
    db.CheckAccount(username,password,(isLogin) =>{
      res.send(JSON.stringify(isLogin));
    })
  }

  saveAccount(req, res){
    let username = "";
    let password = "";
    let email = "";
    if (req.query.username != undefined) username = req.query.username;
    if (req.query.password != undefined) password = req.query.password;
    if (req.query.email != undefined) email = req.query.email;
    db.createAccount(username,password,false,false,(err,model) =>{
      if(err == null){
        res.send(JSON.stringify({err: false}));
      }else{
        res.send(JSON.stringify({err: true}));
      }
    })
  }
}



module.exports = new Controller();
