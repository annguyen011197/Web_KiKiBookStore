module.exports.UpperWord = function UpperWord(value){
 let words = value.split(' ')
 let res =  ''
 words.forEach( e => {
     //console.log(typeof(e))
     res+= e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()+' '
 });
 return res
}