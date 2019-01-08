const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const passport = require('passport')

//login route
router.get('/login', (req, res) => {
    res.render('login')
});

// //logout route
// router.get('/logout' , (req, res) => {
//     res.render('register')
// });

//Register route
router.get('/register' , (req, res) => {
    res.render('register')
});

//Register post

router.post('/register', (req, res ) => {
    const {name, email, password, password2} = req.body;

    let errors = [];

    //checks required fields
    if(!name || !email || !password  || !password2){
        errors.push({ msg : 'Please fill in all fields'})
    }
 
    //check for password match
    if(password !== password2){
        errors.push({ msg: 'Password do not match'})
    }

    //password length > 6
    if(password.length <=  6 ){
        errors.push({msg: 'Password should be greater than 6 character'})
    }


    if(errors.length > 0){
     res.render('register', {
         errors,
         name ,
         email,
         password,
         password2
     })
    }else{
         User.findOne({email: email})
         .then(user =>  {
            if(user) {
             //user exits
             errors.push({msg : 'Email Id already exists'});
             res.render('register', {
                 errors,
                 name,
                 email,
                 password,
                 password2
             });
         }else {
            const newUser = new User({
                name,
                email,
                password
            });

            //Hash Password
            bcrypt.genSalt(10 , (err ,salt) => 
              bcrypt.hash(newUser.password , salt, (err, hash) => {
              if(err) throw err;

              //set password to hash
              newUser.password = hash;

              //Save new user
              newUser.save()
              .then(user => {
                  req.flash('success_msg', 'You are Registered and Can log in');
                  res.redirect('/users/login')
              })
              .catch(error => console.log(error))
            
              }))

         }
        })
    
    }

});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashbord',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req , res, next );
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are loged out');
    res.redirect('/users/login')
})
module.exports = router;