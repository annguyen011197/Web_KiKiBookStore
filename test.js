const utils = require('./controller/Utils')
const fs = require('fs')
const sharp = require('sharp')


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

let map = new Map()
map.set('eqwe23123',2)
map.set('123213',2)
map.set('545454',2)
console.log(map)
map.set('eqwe23123',10)
console.log(map)