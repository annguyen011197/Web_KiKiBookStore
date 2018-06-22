const url = $(location).attr('href')
let regex = new RegExp("[\\?&]id=([^&#]*)")
let id = regex.exec(url)
let offset = 1
let limit = 2

/**Content Template */
var templateContentSource = $("#content-template").html()
var templateContent = Handlebars.compile(templateContentSource)
var content = $("#content")

if(id){
    getBookListType(offset,limit,id[1])
}else{
    loadListCategory()
    .then(res=>{
        let o = 1, l = 2
        res.forEach(element => {
            getBookListType(o,l,element._id)
        })
    })
}

function getBookListType(offset,limit,id){
    $.ajax({
        type: "get",
        url: "./api/booksCategory",
        data: {
            offset: offset,
            limit: limit,
            id: id
        },
        dataType: "json",
        success: function (res) {
            let data ={
                name:res.name,
                items:res.books
            }
            content.append(templateContent(data))
        }
    });
}


  