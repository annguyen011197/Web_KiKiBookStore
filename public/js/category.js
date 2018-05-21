var bookOffset = 1
var bookLimit = 2 
let eventSource = new EventSource(`/html/bookcategory?offset=${bookOffset}&limit=${bookLimit}`);

// $(document).ready(()=>{
//     $('#content').load(`./html/bookcategory?offset=${bookOffset}&limit=${bookLimit}`,)
// })

eventSource.onmessage = e=>{
    $('#content').append(e.data)
    console.log(e.data)
}