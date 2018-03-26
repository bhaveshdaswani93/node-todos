const Mongoclient = require('mongodb').MongoClient;
let url = 'mongodb://heroku_xrtk1ngn:radtob5qo858ohper4clc7d60v@ds123399.mlab.com:23399/heroku_xrtk1ngn';

Mongoclient.connect(url, (err, client)=>{
    if(err){
      return  console.log(err);
    }
    // console.log(client);
  let db =  client.db('heroku_xrtk1ngn');
  /*db.collection('ToDos').insertOne({
      test:'test todo',
      completed:false
  },(err,result)=>{
      if(err){
          console.log('insert failed',err);
      }
      console.log(JSON.stringify(result.ops,undefined,2));
  })*/
  db.collection('Users').insertOne({
      name:'bhavesh',
      age:24,
      address:'ahmrdabad, gujarat'
  },(err,result)=>{
      if(err){
          console.log('user insert failed',err);
      }
      console.log(JSON.stringify(result.ops,undefined,2));
      
  });
  client.close();
}); 