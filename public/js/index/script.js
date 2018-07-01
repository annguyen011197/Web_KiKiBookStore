let offset=1
let limit=30
var templateContentSource=$("#content-template").html()
var templateContent=Handlebars.compile(templateContentSource)
var content=$("#content")
getBookList(offset,limit)
function getBookList(offset,limit){$.ajax({type:"get",url:"./api/books",data:{offset:offset,limit:limit},dataType:"json",success:function(response){let data={name:"Sách",items:response}
$(".loader").hide();content.append(templateContent(data))}})}
getEventList();function getEventList(){var templateContentEventSource=$("#list-event").html()
var templateContentEvent=Handlebars.compile(templateContentEventSource)
var contentEvent=$("#slide-id")
contentEvent.html("");$.ajax({type:"get",url:"./api/getEvent",data:{offset:1,limit:3},dataType:"json",success:function(response){response[0].active="active";let data={event:response}
contentEvent.append(templateContentEvent(data))}})}
function openModal(obj){var templateContentModalSource=$("#model-event-script").html()
var templateContentModal=Handlebars.compile(templateContentModalSource)
var contentModal=$("#modal-event")
contentModal.html("");let name=obj.getAttribute("alt");let detail=obj.getAttribute("detail");contentModal.append(templateContentModal({name:name,detail:detail}));$("#modal-event").modal()}