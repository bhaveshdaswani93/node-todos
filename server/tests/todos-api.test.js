const expect =  require('expect');
const request = require('supertest');
const {ObjectId}  = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
describe('Todos api endpoint check.',()=>{

    it(' should call the todos api and store the result in the mongo database',(done)=>{
        request(app)
        

        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[1].tokens[0].token)
        .expect(422)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find({_creator:users[1]._id}).then(docs=>{
                expect(docs.length).toBe(1);
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
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
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
        .set('x-auth',users[0].tokens[0].token)
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
    it('Should not  fetch a todo',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
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
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .expect(400)
        .end((err)=>{
            if(err){
                return done(err);
            }
            done();
        })
        
    })  
});
describe('DELETE /todos/:id',()=>{
    it('should delete todos',(done)=>{
      let  hexid = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect(res=>{
            expect(res.body.text).toBe(todos[1].text)
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexid).then(result=>{
                expect(result).toBeNull();
                done();
            }).catch(e=>{
                done(e);
            })
        })
    });
    it('should not delete todos',(done)=>{
        let  hexid = todos[1]._id.toHexString();
          request(app)
          .delete(`/todos/${hexid}`)
          .set('x-auth',users[0].tokens[0].token)
          .expect(404)
         
          .end((err,res)=>{
              if(err){
                  return done(err);
              }
              Todo.findById(hexid).then(result=>{
                  expect(result).toBeTruthy();
                  done();
              }).catch(e=>{
                  done(e);
              })
          })
      });
    it('should generate 404 on valid id but record not in database',(done)=>{
        let hexid = new ObjectId().toHexString();
        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(err=>{
            if(err){
                return done(err);
            }
            done();
        })
    })
    it('should give 404 oninvalid id',(done)=>{
        request(app)
        .delete('/todos/123')
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(err=>{
            if(err){
                return done(err)
            }
            done();
        })
    })
});

describe('PATCH /todos/:id',()=>{
    it('should update the todo to completed',(done)=>{
        let hexid = todos[0]._id.toHexString();
        request(app)
        
        .patch(`/todos/${hexid}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({
            text:'hello1',
            completed:true
        })
        .expect(200)
        .expect(res=>{
            expect(res.body.text).toBe('hello1');
            expect(res.body.completed).toBe(true);
            expect(typeof res.body.completedAt).toBe('number');
        })
        .end(err=>{
            if(err){
                return done(err)
            }
            done();
        })
    });
    it('should update not the todo to completed',(done)=>{
        let hexid = todos[0]._id.toHexString();
        request(app)
        
        .patch(`/todos/${hexid}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({
            text:'hello1',
            completed:true
        })
        .expect(404)
        
        .end(err=>{
            if(err){
                return done(err)
            }
            done();
        })
    });
    it('shouod update the todo to completed false',(done)=>{
        let hexid = todos[1]._id.toHexString();
        request(app)
        .patch(`/todos/${hexid}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({
            text:'seed hello',
            completed:false
        })
        .expect(200)
        .expect(res=>{
            expect(res.body.text).toBe('seed hello');
            expect(res.body.completed).toBe(false);
            expect(res.body.completedAt).toBeNull();
        })
        .end(err=>{
            if(err){
                return done(err);
            }
            done();
        })
    })
})
describe('/GET /users/me',()=>{
    it('It should return user',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect(res=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    })

    it('It should return 401',(done)=>{
        request(app)
        .get('/users/me')
        // .set('x-auth',user)
        .expect(401)
        .expect(res=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});
describe('POST /users',()=>{
    it('should create new user',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:'test@demo.com',
            password:'123654789'
        })
        .expect(200)
        .expect(res=>{
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe('test@demo.com');
        })
        .end(err=>{
            if(err){
                return done(err);
            }
            User.findOne({email:'test@demo.com'}).then(doc=>{
                expect(doc).toBeTruthy();
                expect(doc.password).not.toBe('123654789')
                done();
            })
        })
    });
    it('should generate 400 status code on invalid email and password',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:'123',
            password:145,
        })
        .expect(400)
        .end(done);
    })
    it('should genearate 400 on duplicate email.',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:'cdemo123@gmail.com',
            password:12547895
        })
        .expect(400)
        .end(done);
    })
});
describe('POST /users/login',()=>{
    it('should login successfully',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[0].email,
            password:users[0].password
        })
        .expect(200)
        .expect(res=>{
            expect(res.headers['x-auth']).toBeTruthy();
            console.log(res.body._id);
            console.log(typeof res.body._id);
            // expect(res.body._id).toBe(users[0]._id);
            expect(res.body.email).toBe(users[0].email);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findOne({email:users[0].email}).then(doc=>{
                // if(!doc){
                //     return Promise.reject();
                // }
                // expect(doc.tokens).toContain({
                //     token:res.headers['x-auth'],
                //     access:'auth'
                // })  
                done();

            }).catch(e=>{
                done(e);
            })
        })
    });
    it('should give 400 respone on wrong user name password',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:'demo@xyz.com',
            password:14527788
        })
        .expect(400)
        .expect(res=>{
            expect(res.body).toEqual({});
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end(done);
    })
})
describe('DELETE /todos/me/tokrn',()=>{
    it('sgould delete the token',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end(err=>{
            if(err){
                return done(err)
            }
            User.findById(users[0]._id)
            .then(user=>{
                expect(user.tokens.length).toBe(0);
                done()
            }).catch(e=>{
                done(e)
            })

        });
    })
})