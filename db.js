var db = require('./database/db')
const testFolder = './temp/Kynangsong';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
    fs.readFile(testFolder + "/" + file, 'utf8', function (err,obj) {
        if (err) {
          return console.log(err);
        }
        var data = JSON.parse(obj);
        var height = (data.kichthuoc ? data.kichthuoc.split(" x ")[0] : 0)
        var weight = (data.kichthuoc ? data.kichthuoc.split(" x ")[1] : 0)
        db.CreateNewBook({
            name:data.title.trim(),
            price: parseInt(data.oldPrice.replace(".","")),
            date: data.namXB,
            pages:data.sotrang,
            image: [data.image],
            description: '',
            size:{
                width: data.trongluong ? data.trongluong : 0,
                height:  height,
                weight: weight
            },
            typebook:data.hinhthuc,
            language:data.ngonngu,
            category:'Kỹ năng sống',
            publisher: data.nxb,
            author: data.tacgia ? data.tacgia.split(", ")[0] : undefined
        }).then(res=>console.log(res))
        .catch(err=>console.log(err))
        console.log(data);
      });
  });
})




// newFunction();

// function newFunction() {
//     db.UpdateAuthorName({ name: 'yeu lam yeu loz' }, { name: 'yeu lam cai gi' });
// }

// //db.DeleteBookByID({id:'5b0e4f11af269b33f8eb453a'})
// db.DeleteAuthorByName({ name: 'yeu cc' })

db.ReadBookList(1,2).then(res=>console.log(res))