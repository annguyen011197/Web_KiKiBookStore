//script for admin site
let offset = 1
let limit = 10
let type ='dashboard'

var templateMain = Handlebars.compile($("#form-dashboard").html())
var content = $("#content")
var avatar_big = $("#avatar-big")
var username = $('#username')
var templateBookForm = Handlebars.compile($("#form-add-book").html())
var templateEventForm = Handlebars.compile($("#form-add-event").html())
var templateBookRows = Handlebars.compile($("#form-dashboard-row").html())
let progressbar = `
<div class="progress">
<div class="progress-bar progress-bar-striped active" role="progressbar"
aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">
</div>
</div>
`
let maxbook = false

getBookList(offset,limit)
avatar_big.attr("src",LetterAvatar(username.html(),avatar_big.height()))

$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        switch(type){
            case 'dashboard':
            if(maxbook){
                return
            }
            offset=offset+1
            content.append(progressbar)
            ajax({
                type: "get",
                url: "./api/books",
                data: {
                    offset: offset,
                    limit: limit
                },
                dataType: "json",
            }).then(res=>{
                let data ={
                    name:"Sách",
                    booklist:res
                }
                if(res.length==0){
                    maxbook = true
                    setTimeout(()=>{
                        maxbook = false
                    }, 1000*60*5);
                    //5 phut
                }
                $(".progress").remove()
                $(".responsive-table").append(templateBookRows(data))
            })
            break
        }
    }
});

$("#menu_book").on('click',(event)=>{
    event.preventDefault()
    LoadAddBookForm()
})

$("#menu_event").on('click',(event)=>{
    event.preventDefault()
    LoadAddEventForm()
})

$("#menu_dashboard").on('click',(event)=>{
    event.preventDefault()
    type ='dashboard'
    content.empty()
    getBookList(offset,limit)
})



$(document).on('click','#input-button',(event)=>{
    event.preventDefault()
    getBase64($('#input-file').get(0).files[0])
    .then(image=>{
        let val = ValidateFormBook()
        val.image = image
        content.empty()
        content.html(progressbar)
        ajax({
            type: "post",
            url: "./api/book",
            data: val,
            dataType: "json"
        }).then(res=>{
            content.html('Success')
            setTimeout(LoadAddBookForm(),3000)
        }).catch(err=>{
            alert(err)
        })
    })
})

$(document).on('click','#input-button-event',(event)=>{
    event.preventDefault()
    getBase64($('#input-file').get(0).files[0])
    .then(image=>{
        let val = ValidateFormEvent()
        val.image = image
        content.empty()
        content.html(progressbar)
        ajax({
            type: "post",
            url: "./api/addEvent",
            data: val,
            dataType: "json"
        }).then(res=>{
            content.html('Success')
            setTimeout(LoadAddEventForm(),3000)
        }).catch(err=>{
            alert(err)
        })
    })
})

function ValidateFormEvent(){
    let name = $('#input-name').val().trim()
    let description =$('#input-description').val().trim()

    if(name === ''){
        alert('Tên sự kiện không được để trống')
        return false
    }
    if(description === ''){
        alert('Thông tin sự kiện không được để trống')
        return false
    }

    return {
        name: name,
        detail:description
    }
}


function ValidateFormBook(){
    let name = $('#input-name').val().trim()
    let category= $('#input-category').val().trim()
    let price = $('#input-price').val().trim()
    let publisher= $('#input-publisher').val().trim()
    let author=$('#input-author').val().trim()
    let size = {
        width:$('#input-size-width').val().trim(),
        height:$('#input-size-height').val().trim(),
        weight:$('#input-size-weight').val().trim(),
    }

    let covertype = $('#input-covertype').val().trim()
    let language = $('#input-language').val().trim()
    let date = $('#input-date').val().trim()
    let page =$('#input-page').val().trim()
    let description =$('#input-description').val().trim()

    if(name === ''){
        alert('Tên sách không được để trống')
        return false
    }

    if(author===''){
        alert('Tên tác giả không được để trống')
        return false
    }

    if(publisher===''){
        alert('Nhà xuất bản không được để trống')
        return false
    }

    if(price===''){
        alert('Giá không được để trống')
        return false
    }
    return {
        name: name,
        category: category,
        price: price,
        size: {
            width:size.width,
            height:size.height,
            weight:size.weight
        },
        publisher: publisher,
        author: author,
        typebook:covertype,
        language:language,
        date:date,
        pages:page,
        description:description

    }
}


let getCategoryName = ajax({
    type: "get",
    url: "./api/category",
    data: {
        type:'name'
    },
    dataType: "json"
})

let getBook =  ajax({
    type: "get",
    url: "./api/books",
    data: {
        offset: offset,
        limit: limit
    },
    dataType: "json"
})

let getAuthor = ajax({
    type: "get",
    url: "./api/books",
    dataType: "json"
})

let getPublisher = ajax({
    type: "get",
    url: "./api/publisher",
    dataType: "json"
})

function getBookList(offset, limit) {
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
                booklist:response
            }
            content.append(templateMain(data))
        }
    });
}

function LoadAddBookForm(){
    content.empty()
    type ='book'
    Promise.all([getAuthor,getCategoryName,getPublisher])
    .then(([author,category,publisher])=>{
        let data = {
            author: author,
            publisher: publisher,
            category: category
        }
        content.html(templateBookForm(data))
        $( "#input-date" ).datepicker();
    })
    .catch(err=>{
        content.html(templateBookForm({}))
        $( "#input-date" ).datepicker();
        alert(err+'')
    })
}

function LoadAddEventForm(){
    content.empty()
    type ='event'
    content.html(templateEventForm())
}