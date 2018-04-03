const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    console.log(req.body);
    // res.send('123');
    const text = req.body.text;
    const newUser = new Todo({
        text:text
    })
    newUser.save().then(doc=>{
        res.status(200).send(doc);
    },err=>{
        res.status(422).send(err);
    })
});

app.get('/todos',(req,res)=>{
    Todo.find().then(todos=>{
        res.send({
            todos
        })
    },e=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',(req,res)=>{
    // res.send(req.params);
    let id = req.params.id;
    if(!ObjectId.isValid(id))
    {
        return res.status(400).send();
    }
    Todo.findById(id).then(doc=>{
        if(!doc){
            return res.status(404).send();
        }
        res.send(doc);
    },(e)=>{
        res.status(400).send();
    })
})

app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectId.isValid(id))
    {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then(doc=>{
        if(!doc)
        {
            return res.status(404).send();
        }
        res.send(doc);
    }).catch(e=>{
        res.status(400).send();
    })
})

app.listen(port,()=>{
    console.log(`server started listening at port number ${port}`);
})

module.exports = {app};
