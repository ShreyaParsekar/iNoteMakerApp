var jwt = require('jsonwebtoken');
const JWT_SEC = 'MyNameIsShreya';
const User = require('../models/User');

const fetchuser = (req,res,next) => {
     //get the user from jwt token and add it to req object

     const token = req.header('auth-token');
     if(!token){
     res.status(401).send({error: "please authenticate using a valid token"})
     }
     try {
        const data = jwt.verify(token, JWT_SEC)
     req.user = data.user;
    next()
     } catch (error) {
         res.status(401).send({error: "please authenticate using a valid token"})
     }
     
}
 module.exports = fetchuser;

