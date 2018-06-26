const url = $(location).attr('href')
let id = getParameterByName("id") ;
let offset = getParameterByName("offset") ? getParameterByName("offset") : 1;
let limit = getParameterByName("limit") ? getParameterByName("limit") : 2;

/**Content Template */
var templateContentSource = $("#content-template").html()
var templateContent = Handlebars.compile(templateContentSource)
var content = $("#content")

if(id){
    getBookListType(offset,limit,id)
}else{
    loadListCategory()
    .then(res=>{
        res.forEach(element => {
            getBookListType(offset,limit,element._id)
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
            let max = Math.floor(res.count / limit) == 0 ? 1 : Math.floor((res.count / limit) + 0.5);
            let start = Math.floor(offset / 7) * 7 == 0 ? 1 : Math.floor(offset / 7) * 7;
            let end = start == 1 ? start + 6 : start + 7;
            end = end > max ? max : start + 6;
            let page = [];
            for(var i = start; i <= end;++i){
              let disabled = "";
              if(i == offset) disabled = "disabled";
              page.push({text: i,url: `category?offset=${i}&limit=${limit}&id=${id}`,disabled: disabled});
            }
            let data ={
                itemsPage:page,
                name:res.name,
                items:res.books
            }
            $(".loader").hide();
            content.append(templateContent(data))
            
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


  