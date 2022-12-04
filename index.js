const express = require('express');
//to convert string data send by user into json 
const bodyParser=require('body-parser');
//for ejs layout
const expressLayout=require('express-ejs-layouts');
//for making cookie
const cookieParser=require('cookie-parser');
const port=8000;

//Database Configuration
const db=require('./config/mongoose');

const app=express();

//setup view engine as ejs
app.set('view engine','ejs');
app.set('views','./views');

//use for ejs layout all css file at top of the layout page  
app.set('layout extractStyles',true);

//convert string data(send by user at time of creting user) into json format 
app.use(bodyParser.urlencoded({extended:false}));
//to make access static files 
app.use(express.static('./assets'));
//use layouts
app.use(expressLayout);

//cookie parser for set up cookie 
app.use(cookieParser());
//sending all req to routes
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log("Error in server run :: ",err);
        return;
    }
    console.log("Server is up on port "+port);
})