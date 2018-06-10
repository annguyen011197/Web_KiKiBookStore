var db = require('./database/db')

// db.CreateNewBook({
    // name:"Con mèo bú con chó",
    // price: 3000,
    // date: new Date(),
    // pages:200,
    // image: [''],
    // description: '',
    // size:{
    //     width:30,
    //     height:100,
    //     weight:100
    // },
    // typebook:'Mềm',
    // language:'Tiếng việt',
    // category:'Đam mỹ',
    // publisher:'NXB Đéo đi hoc',
    // author:'Yeu cc'
// }).then(res=>console.log(res))
// .catch(err=>console.log(err))

// newFunction();

// function newFunction() {
//     db.UpdateAuthorName({ name: 'yeu lam yeu loz' }, { name: 'yeu lam cai gi' });
// }

// //db.DeleteBookByID({id:'5b0e4f11af269b33f8eb453a'})
// db.DeleteAuthorByName({ name: 'yeu cc' })

db.ReadBookList(1,2).then(res=>console.log(res))