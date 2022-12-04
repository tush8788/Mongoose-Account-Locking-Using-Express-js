const mongoose=require('mongoose');

const locking=require('mongoose-account-locking');

const userSchma=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

//adding plugin for locking user after some time of fail login
var options = {
    maxLoginAttempts : 5
   , lockTime : 5 * 60 * 60 * 4800  //lock user 24 hours
   , username : 'email'
   , password : 'password'
};

userSchma.plugin(locking, options)


const User=mongoose.model('User',userSchma);



module.exports=User;