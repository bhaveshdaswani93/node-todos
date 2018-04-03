const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '6ac12769f248b00af8e0ee25';
let userid = '5abb69ad14748113f8cd5430';
if(!ObjectId.isValid(id)) {
    console.log('invalid id');
}
// Todo.find({
//     _id:id
// }).then(doc=>{
//     console.log('find:',doc)
// })

// Todo.findOne({
//     _id:id
// }).then(doc=>{
//     console.log('findone: ',doc);
// });

Todo.findById(id).then(doc=>{
    console.log('findbyid',doc);
}).catch(e=>{
    console.log('err:',e);
})

User.findById(userid).then(doc=>{
    console.log('user findbyid',doc);
})