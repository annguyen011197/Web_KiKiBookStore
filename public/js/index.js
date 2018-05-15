var bookOffset = 0
var bookLimit = 2 

$(document).ready(()=>{
    $('#content').load(`./html/book?offset=${bookOffset}&limit=${bookLimit}`,)
})


// function addBook(data) {
//     var scriptHTML = $('#book_store')[0].innerHTML
//     var template = Handlebars.compile(scriptHTML)
//     var html = template({ items: data });
//     console.log(data)
//     $("#books").html(html)
// }

// function addMenu(data) {
//     var scriptHTML = $('#book_types')[0].innerHTML
//     var template = Handlebars.compile(scriptHTML)
//     var html = template({ booktypes: data });
//     $("#types").append(html)
// }