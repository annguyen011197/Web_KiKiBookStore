//script for admin site
let offset = 1
let limit = 10
let type ='dashboard'
let categoryoffset = 1
let categorylimit = 10
let orderoffset =1
let orderlimit = 10

var templateMain = Handlebars.compile($("#form-dashboard").html())
var content = $("#content")
var avatar_big = $("#avatar-big")
var avatar_mini = $("#avatar-mini")
var username = $('#username')
var templateBookForm = Handlebars.compile($("#form-add-book").html())
var templateEventForm = Handlebars.compile($("#form-add-event").html())
var templateBookRows = Handlebars.compile($("#form-dashboard-row").html())
var templateEditBookForm = Handlebars.compile($("#form-edit-book").html())
var templateCategory = Handlebars.compile($("#form-category").html())
var templateCategoryRows = Handlebars.compile($("#form-category-row").html())
var templateOrder = Handlebars.compile($("#form-order").html())
var templateOrderRows = Handlebars.compile($("#form-order-row").html())
let progressbar = `
<div class="progress">
<div class="progress-bar progress-bar-striped active" role="progressbar"
aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">
</div>
</div>
`
let maxbook = false
alertify.success('Welcome admin')
$(document).on({
    ajaxStart: function () { 
        console.log('Start ajax')
        $('body').addClass("loading"); 
    },
    ajaxStop: function () { $('body').removeClass("loading"); }
});

getBookList(offset,limit)
avatar_big.attr("src",LetterAvatar(username.html(),avatar_big.height()))
avatar_mini.attr("src",LetterAvatar(username.html(),avatar_mini.height()))

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
    let tempLimit = offset*limit
    offset=1
    getBookList(offset,tempLimit)
})


$(document).on('click',`a[href='#category']`,event=>{
    event.preventDefault()
    type ='category'
    content.empty()
    let tempLimit = categoryoffset*categorylimit
    categoryoffset=1
    getCategoryList(offset,tempLimit)
})

$(document).on('click',`a[href='#oder']`,event=>{
    event.preventDefault()
    type ='category'
    content.empty()
    let tempLimit = orderoffset*categorylimit
    orderoffset=1
    getOrderList(offset,tempLimit)
})

//search
$('a[href="#search"]').on('click', function(event) {
    event.preventDefault();
    $('#search').addClass('open');
    $('#search > form > input[type="search"]').focus();
});


$('#search, #search button.close').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
        $(this).removeClass('open');
    }
});

$('form').submit(function(event) {
    event.preventDefault();
    if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
        $('#search').removeClass('open');
    }
    let type = $('form').find(`input[type='search']`).val()
    type = type.replace(' ','+')
    ajax({
        type:'get',
        url: `/api/search?name=${type}`
    }).then(res=>{
        console.log(res)
        let data ={
            booklist: res.books
        }
        content.empty()
        content.append(templateMain(data))
    }).catch(err=>{
        alertify('Xảy ra lỗi')
    })
    return false;
})

//delete
$(document).on('click','.delete',(event)=>{
    event.preventDefault()
    let t = $(event.target)
    let id = t.closest('a').attr('data-id')
    ajax({
        type:'get',
        url:`/api/deletebook?id=${id}`
    }).then((res) => {
        alertify.success("Đã xóa thành công")
        t.parents('li').remove()
    }).catch((err) => {
        alertify.error('Xảy ra lỗi')
    });
})
//edit
$(document).on('click','.edit',(event)=>{
    event.preventDefault()
    let t = $(event.target)
    let id = t.closest('a').attr('data-id')
    ajax({
        type:'get',
        url:`/api/details?id=${id}`
    }).then(res=>{
        console.log(res)
        type="Book"
        content.empty()
        content.html(templateEditBookForm(res))
        $( "#input-date" ).datepicker();
    }).catch((err)=>{
        console.log(err)
        alertify.error('Xảy ra lỗi')
    })
})



$(document).on('click','#input-button',(event)=>{
    event.preventDefault()
    let files = $('#input-file').get(0).files[0]
    if(files){
        getBase64(files)
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
    }else{
        let val = ValidateFormBook()
        val.image = ''
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
    }

})

$(document).on('click','#input-button-id',(event)=>{
    event.preventDefault()
    let files = $('#input-file').get(0).files[0]
    if(files){
        getBase64(files)
        .then(image=>{
            let val = ValidateEditBook()
            val.image = image
            content.empty()
            content.html(progressbar)
            ajax({
                type: "post",
                url: "./api/editbook",
                data: val,
                dataType: "json"
            }).then(res=>{
                content.html('Success')
                setTimeout($("#menu_dashboard").click(),3000)
            }).catch(err=>{
                alert(err)
            })
        })
    }else{
        let val = ValidateEditBook()
        val.image = ''
        content.empty()
        content.html(progressbar)
        ajax({
            type: "post",
            url: "./api/editbook",
            data: val,
            dataType: "json"
        }).then(res=>{
            content.html('Success')
            setTimeout($("#menu_dashboard").click(),3000)
        }).catch(err=>{
            alert(err)
        })
    }

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
            alert(err.err)
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

function ValidateEditBook(){
    let name = $('#input-name').val().trim()
    let price = $('#input-price').val().trim()
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
    let id = $('#editBookForm').attr('data-id')

    if(name === ''){
        alert('Tên sách không được để trống')
        return false
    }
    if(price===''){
        alert('Giá không được để trống')
        return false
    }
    return {
        _id:id,
        name: name,
        price: price,
        size: {
            width:size.width,
            height:size.height,
            weight:size.weight
        },
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
    url: "./api/author",
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

function getCategoryList(offset,limit){
    ajax({
        type:'get',
        url:"./api/category",
        data:{
            offset:offset,
            limit:limit
        },
        dataType:'json'
    }).then(res=>{
        let data = {
            category : res
        }
        console.log($("#form-category-row").html())
        content.append(templateCategory())
        $(".responsive-table").append(templateCategoryRows(data))
    })
}

function getOrderList(offset,limit){
    ajax({
        type:'get',
        url:"./api/cartlist",
        data:{
            offset:offset,
            limit:limit
        },
        dataType:'json'
    }).then(res=>{
        let data = {
            order : res
        }
        content.append(templateOrder())
        $(".responsive-table").append(templateOrderRows(data))
    })
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
