const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/register',async (req, res) => {
    try{
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        const newUser = await user.save();
        res.send(newUser);
    }catch(error){
        res.status(404).json(error);
    }
});

module.exports = router;