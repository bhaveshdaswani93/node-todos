const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(result=>{
//     console.log(result);
// })
// Todo.findByIdAndRemove('5ac3cb3a0361b700145d6111').then(result=>{
//     console.log(result);
// })
// Todo.findOneAndRemove({_id:'5ac3cb9f0361b700145d6112'}).then(doc=>{
//     console.log(doc);
// })