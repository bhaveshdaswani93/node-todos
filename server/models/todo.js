const mongoose = require('mongoose');
const Todo = mongoose.model('Todo',{
    text:{
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    completed:{
        default:false,
        type:Boolean
    },
    completedAt:{
        type:Number,
        default:null
    }
});

module.exports = {Todo};