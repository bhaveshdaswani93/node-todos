const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{VALUE} is invalid email address. '
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6

    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();
    return _.pick(userObj,['_id','email']);
}

userSchema.methods.genrateToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id,access},process.env.JWT_SECRET);
    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    })
}
userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }
   return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':decoded.access
    })
}
userSchema.pre('save',function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})
userSchema.statics.findByCredential = function(email,password) {
    let User = this;
    return User.findOne({email}).then(user=>{
        if(!user) {
            return Promise.reject();
        }
        return bcrypt.compare(password,user.password).then((res)=>{
            if(!res){
                return Promise.reject();
            }
            return user;
        })
    })
}

userSchema.methods.removeToken = function(token) {
    let user =this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    })
}
const User = mongoose.model('User',userSchema);

module.exports = {User};