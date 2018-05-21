var typeOffset = 1
var typeLimit = 3
$("img").lazyload();
console.log($("img"))
$(document).ready(()=>{
    $('#types').load(`./html/booktype?offset=${typeOffset}&limit=${typeLimit}`)
})

function showMenu() {
    if ($("#menuBook").hasClass('show')) {
        $("#menuBook").removeClass('show')
    } else {
        $("#menuBook").addClass('show')
    }
}
