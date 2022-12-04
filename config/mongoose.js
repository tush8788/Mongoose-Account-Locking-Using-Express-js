const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/CointabDB');

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error to connect with db"));

db.once('open',function(){
    console.log("Database Connect Successfuly .");
})

module.exports=db;