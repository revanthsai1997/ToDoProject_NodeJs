const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator')
const User = require('../models/User');

const router = express.Router();

router.post('/register',async (req, res) => {
    try{
        if(!validator.isEmail(req.body.email)){
            res.status(400).json({message:"Email is Invalid"});
            return;
        }

        const user = await User.findOne({email: req.body.email});
        if(user != null){
            res.status(400).json({message:"User already exits with given email"});
            return;
        }
        bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS)) 
        .then(async hash =>{
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            });
    
            const newUser = await user.save();
            res.send(newUser);
        })
        .catch(error =>{
            console.error("Hashing failed");
            res.status(500).json(error);
        });
    }catch(error){
        res.status(404).json(error);
    }
});

module.exports = router;