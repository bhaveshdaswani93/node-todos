const expect =  require('expect');
const request = require('supertest');
const {ObjectId}  = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectId(),
    text:'seed 1'
},{
    _id:new ObjectId(),
    text:'seed 2'
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
})
describe('Todos api endpoint check.',()=>{

    it(' should call the todos api and store the result in the mongo database',(done)=>{
        request(app)
        .post('/todos')
        .send({text:'Super test'})
        .expect(200)
        .expect(res=>{
            expect(res.body.text).toBe('Super test');
        })
        .end((err,res)=>{
            if(err){
                // console.log(err);
                return done(err);
            }
            // console.log(res.body);
            Todo.find({text: 'Super test'})
            .then(docs=>{
                // console.log(docs);
               
                expect(docs[0].text).toBe('Super test');
                expect(docs.length).toBe(1);
                done();
            }).catch(e=>{
                done(e);
            })
            
            
        })
        
    });

    it('Should not create recored in the database',(done=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(422)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find({}).then(docs=>{
                expect(docs.length).toBe(2);
                done();
            }).catch(e=>{
                done(e);
            })
        })
    }))
});

describe('GET /todos',()=>{
    it('should bring all todos from database',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
            done();
        }).catch(e=>{
            done(e);
        })
        
    })
});

describe('GET /todos/:id',()=>{
    it('Should fetch a todo',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(todos[0].text)
        })
        .end((err)=>{
            if(err){
                return done(err);
            }
            done();
        })
    })
    it('should not fetch a todo',(done)=>{
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end((err)=>{
            if(err){
                return done(err);
            }
            done();
        })
    })
    it('should not fetch record',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(400)
        .end((err)=>{
            if(err){
                return done(err);
            }
            done();
        })
        
    })  
})