const express = require('express');
const router=express.Router();

const homeController=require('../controller/home_controller');

//handling get reqs
router.get('/',homeController.signInPage);
router.get('/signup',homeController.signUpPage);
//profile page
router.get('/profile',homeController.profile);
//signout
router.get('/signout',homeController.signOut);

//handling post reqs
//crete user
router.post('/create-user',homeController.createUser);
//sign in user
router.post('/signin-user',homeController.signInUser);

module.exports=router;