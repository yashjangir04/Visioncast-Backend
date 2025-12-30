const express = require('express');
const router = express.Router();
const userModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    const existingUser = await userModel.findOne({email});
    
    if(existingUser) {
        return res.status(400).json({ msg : "User already exists"} );
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        name,
        email,
        password: encryptedPassword
    });

    return res.status(201).json({ msg : "User created successfully"} );
})

router.post('/login', async (req, res) => {
    const  {email , password} = req.body;
    const existingUser = await userModel.findOne({email});
    
    if(!existingUser) {
        return res.status(404).json({ msg : "User not found"} );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if(!isMatch) {
        return res.status(401).json({ msg : "Invalid credentials"} );
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET , { expiresIn : "1d" });
    return res.status(200).json({ token });
})

module.exports = router ;   