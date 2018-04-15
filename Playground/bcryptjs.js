const bcrypt = require('bcryptjs')

password = '123abc!';

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
        bcrypt.compare(password,hash+1,(err,res)=>{
            console.log(res);
        })
    })
})
let hash = '';
