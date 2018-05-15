const sharp = require('sharp');
const fs = require('fs')
var path =require('path')

class Image {
    resizeImage(name,height,width,callback){
        fs.readFile(path.join(__dirname,'../media',name),
        (err,data)=>{
            sharp(data).resize(width,height)
            .toBuffer()
            .then(data => callback(data))
            .catch(err => console.log(err))
        })
    }
}

module.exports = new Image()