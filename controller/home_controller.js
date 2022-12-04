const UserDB = require('../models/User');
//use for locking user and incripting password
const locking=require('mongoose-account-locking');

//sign in page
module.exports.signInPage = function (req, res) {
    //if user is login this page is not accessable 
    if (Object.keys(req.cookies).length !== 0) {
        return res.redirect("/profile");
    }

    //returning page
    return res.render('signin', {
        title: "Sign In"
    })
}

//sign up page
module.exports.signUpPage = function (req, res) {
    //if user is login this page is not accessable 
    if (Object.keys(req.cookies).length !== 0) {
        return res.redirect("/profile");
    }
    //returning page
    return res.render('signup', {
        title: "Sign Up"
    })
}

//Create new User 
module.exports.createUser = function (req, res) {
    //checking password and conform password match or not 
    if (req.body.password != req.body.Conformpassword) {
        console.log("password not match");
        return res.redirect("back");
    }

    //checking given email is already register or not if yes redirct sign in page
    UserDB.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("Error in finding User in CreateUser :: ", err);
            return;
        }

        //if email is not register create new user
        if (!user) {
            UserDB.create({ email: req.body.email, password: req.body.password }, function (err, newUser) {
                if (err) {
                    console.log("Error in user creation in createUser :: ", err);
                    return;
                }

                // console.log(newUser);
                return res.redirect('/');
            })
        }
        else {
            console.log("email is already exssits");
            return res.redirect('/')
        }
    })
}

//sign in user
module.exports.signInUser = function (req, res) {
    
    let email=req.body.email,password=req.body.password;
    //authenticate user  
    UserDB.getAuthenticated(email, password, function(err, user,reason) {

        if (err) 
        {
            console.log("Error in finding user inside signInUser ::", err);
            return;
        }
        //if user is authenticated then 
        if(user){
            // console.log("user: ",user);
            res.cookie('user_id', user.id);
            return res.redirect("/profile");
        }

        // console.log("user: ",user);
        // console.log("reason: ",reason);
        // if any issue in authentication 
        var reasons = UserDB.failedLogin;
        switch(reason){
            case reasons.NOT_FOUND:
                // handle not found
                console.log('User is not found');
                break;
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                console.log('Invalid Password');
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                console.log('Your account has been locked for next 24 hours.');
                break;
        }

        return res.redirect("/");
    })
}

//profile page 
module.exports.profile = function (req, res) {
    // check user is login or not if not rediect sign-in page
    if (Object.keys(req.cookies).length === 0) {
        return res.redirect("/");
    }

    //if user is login then finding user using cookie
    UserDB.findById(req.cookies.user_id, function (err, user) {
        if (err) {
            console.log("Error in finding user inside profile ::", err);
            return;
        }
        //user found then users data send in profile page
        if (user) {
            res.locals.user=user;
            res.render('profile', {
                title: "Profile",
                user: user
            });
        }
        else {
            //if user not found mean someone change the cookie 
            //send to logout because wrong id store in cookie 
            return res.redirect("/signout");
        }
    })
}

//sign out
module.exports.signOut = function (req, res) {
    //just deleting cookie
    res.clearCookie('user_id');
    return res.redirect("/");
}