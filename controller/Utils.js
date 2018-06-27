const cryto = require('crypto')
const secret = 'webdevABBA'

module.exports.UpperWord = function UpperWord(value){
 let words = value.split(' ')
 let res =  ''
 words.forEach( e => {
     //console.log(typeof(e))
     res+= e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()+' '
 });
 return res
}

module.exports.decodeBase64Image = (dataString) => {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

module.exports.hashName = (str)=>{
    let guid = (S4() + S4() + "_" + S4() + "_4" + S4().substr(0,3) + "_" + S4() + "_" + S4() + S4() + S4()).toLowerCase()+'.'+str;
    return guid
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

module.exports.validURL = (str) => {
    var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    if(!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  }

module.exports.createID = ()=>{
    function uuidv4() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    let now = new Date()
    return uuidv4()+now.getUTCMilliseconds().toString()
}
