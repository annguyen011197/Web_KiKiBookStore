$('.oder-button').hover((event)=>{
  event.preventDefault()
  let e = $(event.target)
  e.append(' Thêm vào giỏ hàng')
  e.stop(true, false).animate({ width: "300px" })
},(event)=>{
  event.preventDefault()
  let e = $(event.target)
  let span =   e.find('span')
  e.empty()
  e.html(span)
  e.stop(true, false).animate({ width: "60px" })
})

let tempid = getCookie('tempID')

$('.oder-button').on('click',(event)=>{
  event.preventDefault()
  let data = {
    product: $('#idBook').text(),
    size: $(`input[name='quantity'`).val()
  }
  data.size  = data.size.length > 0 ? data.size : 1
  tempid = getCookie('tempID')
  if(tempid.length > 0){
    data.id = tempid
  }
  ajax({
    type:'post',
    url:'./api/cart',
    data:data,
    dataType:'json'
  }).then(res=>{
    tempid = res.id
    document.cookie = 'tempID='+res.id
    $('#cart-size').html(res.size)
    alertify.success("Đã thêm một sản phẩm vào giỏ hàng")
  }).catch(err=>{
    console.log(err)
    alertify.alert("Xảy ra lỗi")
  })
})

function loadComment(id) {
  var commentContentSource = $("#list-comment").html()
  var commentContent = Handlebars.compile(commentContentSource)
  var comment = $("#comments");
  var btn = $("#btn-load-more");
  var loader = $(".loader");
  var page = comment.attr("page");
  btn.hide();
  loader.show();
  $.ajax({
    type: "get",
    url: "./api/comments",
    data: {
      id: id,
      offset: page,
      limit: 5,
    },
    dataType: "json",
    success: function (response) {
      let data = {
        listComment: response
      }
      comment.append(commentContent(data));
      comment.attr("page",1 + parseInt(page));
      if(response.length == 5)
        btn.show();
      loader.hide();
    }
  });

}

function formSubmit(){
  var name = document.getElementById("summary_field").value;
  var message = document.getElementById("review_field").value;
  var id = document.getElementById("idBook").innerHTML;
  var dataString = 'idBook=' + id + '&title='+ name + '&message=' + message;
  jQuery.ajax({
      url: "api/comments",
      data: dataString,
      type: "POST",
      success: function(data){
          $("#myForm").html(data);
          alert("Gửi thành công nhận xét");
          document.getElementById("summary_field").value = ""
          document.getElementById("review_field").value = "";
          var comment = $("#comments");
          comment.html('');
          comment.attr("page",1);
          loadComment($("#idBook").text());
      },
      error: function (){}
  });
return true;
}
