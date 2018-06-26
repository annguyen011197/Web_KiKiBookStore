const url = $(location).attr('href')
let nameSearch = getParameterByName("name") ;
let offset = getParameterByName("offset") ? getParameterByName("offset") : 1;
let limit = getParameterByName("limit") ? getParameterByName("limit") : 2;

/**Content Template */
var templateContentSource = $("#content-template").html()
var templateContent = Handlebars.compile(templateContentSource)
var content = $("#content")

getBookListType(offset,limit,nameSearch)

function getBookListType(offset,limit,name){
    $.ajax({
        type: "get",
        url: "./api/search",
        data: {
            offset: offset,
            limit: limit,
            name: name
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
              page.push({text: i,url: `search?offset=${i}&limit=${limit}&name=${nameSearch}`,disabled: disabled});
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


  