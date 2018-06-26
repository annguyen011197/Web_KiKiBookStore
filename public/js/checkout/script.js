// $(document).ready(()=>{
//     let price  = 0
//     $('.price').each((index,value)=>{
//         price += parseInt($(value).contents().not($(value).children()).text())
//     })
//    $('#temp-paid').text(`${price} đ`)
//    $('#total-paid').text(`${price} đ`)
// })
$body = $("body");

$(document).on({
    ajaxStart: function () { 
        $body.addClass("loading"); 
    },
    ajaxStop: function () { $body.removeClass("loading"); }
});


var cartDetailTemplate = Handlebars.compile($("#cartlist-template").html())
LoadCartDetails()


function LoadCartDetails() {
    let tempid = getCookie('tempID')
    let url = '/api/cart'
    if (tempid.length > 0) {
        url = `${url}?id=${tempid}`
    }
    ajax({
        type: 'get',
        url: url
    }).then(res => {
        let data = {}
        data.cartlist = res
        if(res.size > 0){
            $('#cart-detail').empty()
            $('#cart-detail').html(cartDetailTemplate(data))
            $('#temp-paid').text(`${res.total} đ`)
            $('#total-paid').text(`${res.total} đ`)
        }else{
            alertify.success("Hiện chưa có sản phẩm trong giỏ hàng")
            $('#cart-detail').empty()
            $('#cart-detail').html(`
            <div>Giỏ hàng trống</div>
            <button class="btn btn-danger order-btn" id="back-btn">Quay lại mua sắm</button>
            `)
        }
    }).catch(err=>{
        alertify.success("Hiện chưa có sản phẩm trong giỏ hàng")
    })
}

$(document).on('click', event => {
    let t = $(event.target)
    if(t.hasClass('deletebutton')){
        event.preventDefault()
        let tempid = getCookie('tempID')
        let product = t.attr('data-id')
        console.log(product)
        console.log(tempid)
        ajax({
            type:'post',
            url:'/api/cartremoveitem',
            data:{
                id:tempid,
                product:product
            },
            dataType:'json'
        }).then(res=>{
            LoadCartDetails()
        }).catch(err=>{
            LoadCartDetails()
        })
    }
})

$(document).on('click','#back-btn',event=>{
    let t = $(event.target)
    location.href = '/'
})

$(document).on('click','#order-btn',event=>{
    let t = $(event.target)
    let cart_list = $('.cart-detail')
    let data = {
        id: getCookie('tempID'),
        list: {}
    }
    cart_list.each(index=>{
        let e = cart_list.eq(index)
        let id = e.find('.deletebutton').attr('data-id')
        let size = e.find(`input[type='number']`).val()
        data.list[id] = size
    })

    ajax({
        type:'post',
        url:'/api/savecart',
        data: data,
        dataType:'json'
    }).then(res=>{
        console.log(res)
        //location.href = '/'
    }).catch(err=>{
        console.log(err)
        switch(err.status){
            case 403:
            alertify.alert('Hãy tạo tài khoản mới để tiến hành đặt hàng', function(){ 
                let $signup_button = $('#signup-button')
                $signup_button.click()
            });
            break
            case 402:
            alertify.alert('Hãy thêm thông tin để tiến hành đặt hàng', function(){ 
                location.href = '/account'
            });
            break
        }

    })
})
