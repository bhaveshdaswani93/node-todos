const Mongoclient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
let url = 'mongodb://heroku_xrtk1ngn:radtob5qo858ohper4clc7d60v@ds123399.mlab.com:23399/heroku_xrtk1ngn';

Mongoclient.connect(url, (err, client)=>{
    if(err){
      return  console.log(err);
    }
    // console.log(client);
  let db =  client.db('heroku_xrtk1ngn');
 
  db.collection('Users').findOneAndUpdate({
      _id: new ObjectId('5ab8c94e68fa78f292ea8803')
  },{
      $set:{
          name:'gajendra'
      },
      $inc:{
         age:-6 
      }
  },{
      returnOriginal:false
  }).then(result=>{
      console.log(result)
  })
//   client.close();
}); 