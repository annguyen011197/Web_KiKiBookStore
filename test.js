const utils = require('./controller/Utils')
const fs = require('fs')
const sharp = require('sharp')
const mongoose  = require('mongoose')

let id1 ='4edd40c86762e0fb12000003'
let id2 ='4edd40c86762e0fb12321313'
let arr = []
arr.push(mongoose.Types.ObjectId(id1))
arr.push(mongoose.Types.ObjectId(id2))
console.log(arr)
arr.push(mongoose.Types.ObjectId(id1))
arr = Array.from(new Set(arr))

console.log(arr)

//console.log(utils.validURL('https://www.fahasa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/8/9/8932000129608.png'))
// let arr = [{
//     book: 'eqwe23123',
//     value: 1
// },{
//     book: '123213',
//     value: 1
// },{
//     book: '545454',
//     value: 1
// }]

// console.log(arr)
// arr = [...arr,{
//     book: 'eqwe23123',
//     value: 3
// }]
// console.log(arr)

