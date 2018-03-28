const Mongoclient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
let url = 'mongodb://heroku_xrtk1ngn:radtob5qo858ohper4clc7d60v@ds123399.mlab.com:23399/heroku_xrtk1ngn';

Mongoclient.connect(url, (err, client)=>{
    if(err){
      return  console.log(err);
    }
    // console.log(client);
  let db =  client.db('heroku_xrtk1ngn');
//  db.collection('ToDos').deleteMany({text:'eat lunch'}).then(result=>{
//      console.log(result);
//  })

/*db.collection('ToDos').deleteOne({text:'eat lunch'}).then(result=>{
    console.log(result);
});*/
db.collection('ToDos').findOneAndDelete({_id: new ObjectId('5ab9b4ddf78b348e81141c21')}).then(result=>{
    console.log(result)
})
//   client.close();
}); 