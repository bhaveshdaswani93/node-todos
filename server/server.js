require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/todos',authenticate,(req,res)=>{
    console.log(req.body);
    // res.send('123');
    const text = req.body.text;
    const newUser = new Todo({
        text:text,
        _creator:req.user._id
    })
    newUser.save().then(doc=>{
        res.status(200).send(doc);
    },err=>{
        res.status(422).send(err);
    })
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({_creator:req.user._id}).then(todos=>{
        res.send({
            todos
        })
    },e=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',authenticate,(req,res)=>{
    // res.send(req.params);
    let id = req.params.id;
    if(!ObjectId.isValid(id))
    {
        return res.status(400).send();
    }
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    }).then(doc=>{
        if(!doc){
            return res.status(404).send();
        }
        res.send(doc);
    },(e)=>{
        res.status(400).send();
    })
})

app.delete('/todos/:id',authenticate,async(req,res)=>{
    try{
        let id = req.params.id;
        if(!ObjectId.isValid(id))
        {
            return res.status(404).send();
        }
        let doc = await Todo.findOneAndRemove({
            _id:id,
            _creator:req.user._id
        })
        if(!doc)
        {
            return res.status(404).send();
        }
        res.send(doc);
    }catch(e){
        res.status(400).send();
    }
    
    // Todo.findOneAndRemove({
    //     _id:id,
    //     _creator:req.user._id
    // }).then(doc=>{
    //     if(!doc)
    //     {
    //         return res.status(404).send();
    //     }
    //     res.send(doc);
    // }).catch(e=>{
    //     res.status(400).send();
    // })
});
app.patch('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    if(_.isBoolean(body.completed) && body.completed ){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completedAt = null;
    }
    if(!ObjectId.isValid(id))
    {
        return res.status(404).send();
    }
    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },body,{new:true}).then(doc=>{
        if(!doc)
        {
            return res.status(404).send();
        }
        res.send(doc);
    }).catch(e=>{
        res.status(400).send();
    })
})
app.post('/users',async (req,res)=>{
    let body = _.pick(req.body,['email','password']);
    // body.tokens[0] = {
    //     access:123,
    //     token:'hello world'
    // };
    let newUser = new User(body);
    try {
       await newUser.save()
       let token = await newUser.genrateToken();
       res.header('x-auth',token).send(newUser);
    }catch(e){
        res.status(400).send(e);
    }
    
    // newUser.save().then(doc=>{
    //     // res.send(doc)
    //     return newUser.genrateToken()
    // }).then((token)=>{
    //     res.header('x-auth',token).send(newUser);
    // })
    // .catch(e=>{
    //     res.status(400).send(e);
    // })
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
})
app.post('/users/login',async (req,res)=>{
    let body = _.pick(req.body,['email','password']);
    // res.send(body);
    try {
        const user = await User.findByCredential(body.email,body.password);
        const token =await user.genrateToken();
        res.header('x-auth',token).send(user);

    } catch(e) {
        res.status(400).send();
    }
   
    // User.findByCredential(body.email,body.password).then(user=>{
    //     // let token = user.tokens[0].token;
    //     // res.header('x-auth',token).send(user);
    //     return  user.genrateToken().then((token)=>{
    //         res.header('x-auth',token).send(user);
    //     });
    // })
    // .catch(e=>{
    //     res.status(400).send();
    // })
});
app.delete('/users/me/token',authenticate,async (req,res)=>{

    let user = req.user;

    try {
        await user.removeToken(req.token);
        res.status(200).send();
    } catch(e){
        res.status(400).send();
    }
    // user.removeToken(req.token).then(()=>{
    //     res.status(200).send();
    // },()=>{
    //     res.status(400).send();
    // })
})

app.listen(port,()=>{
    console.log(`server started listening at port number ${port}`);
})

module.exports = {app};
