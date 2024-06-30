
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SEC = 'MyNameIsShreya'
//Route1: Create user using POST "/api/auth"
router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
], async (req, res) => {
    // Validate the request
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    // Process the request
    const { email, password, name } = req.body;
    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        user = new User({
            email,
            password: secPassword,
            name
        });
        
        // Save the user to the database
        await user.save();

        const data ={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign( data , JWT_SEC);
        console.log(authToken)
        // res.send(user);
       
        res.json({authToken})


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//Route2: authenticate user using POST "/api/auth/login"
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').exists().withMessage('Password must be at least 6 characters long'),
    
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
const {email, password} =req.body;
try {
    let user = await User.findOne({email})
    if(!user){
        success= false;
        return res.status(400).json({success, error: "Please try to login with valid email and password"})
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
        success= false;
        return res.status(400).json({ success, error: "Please try to login with valid email and password"}) 
    }
               const data ={
                 user:{
                   id:user.id
                }
             }
        const authToken = jwt.sign( data , JWT_SEC);
        success= true;
      res.json({success,authToken})


} catch (error) {
    console.error(error.message);
        res.status(500).send('Server error');
    }


})


//Route3: get loggedin user details using POST "/api/auth/getUser". Login required
router.post('/getUser', fetchuser, async (req, res) => {
    console.log('getUser route accessed');
try {
  const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
        res.status(500).send('Server error');
    }

})
module.exports = router;



