const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


let userOneId = new ObjectId();
let userTwoId = new ObjectId();
const users = [{
    _id: userOneId,
    email:'b123hash@gmail.com',
    password:'123abcz',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET)

    }]
},
    {
        _id:userTwoId,
        email:'cdemo123@gmail.com',
        password:'ccc123',
        tokens:[{
            access:'auth',
            token: jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET)
    
        }]
    }
];

populateUsers = (done)=>{
    User.remove({}).then(()=>{
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
       return Promise.all([userOne,userTwo])
       
    }) .then(()=>{
        done();
    })
}

const todos = [{
    _id: new ObjectId(),
    text:'seed 1',
    completed:false,
    _creator:users[0]._id
},{
    _id:new ObjectId(),
    text:'seed 2',
    completed:true,
    completedAt:123,
    _creator:users[1]._id
}];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
};

module.exports = {todos,populateTodos,users,populateUsers};