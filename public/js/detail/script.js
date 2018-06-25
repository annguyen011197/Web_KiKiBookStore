
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
          console.log(data);
      },
      error: function (){}
  });
return true;
}
