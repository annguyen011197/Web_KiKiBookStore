let offset = 1
let limit = 2

/**Content Template */
var templateContentSource = $("#content-template").html()
var templateContent = Handlebars.compile(templateContentSource)
var content = $("#content")

getBookList(offset,limit)

function getBookList(offset,limit){
    $.ajax({
        type: "get",
        url: "./api/books",
        data: {
            offset: offset,
            limit: limit
        },
        dataType: "json",
        success: function (response) {
            let data ={
                name:"Sách",
                items:response
            }
            $(".loader").hide();
            content.append(templateContent(data))
        }
    });
}