const Userdb=require('../model/model');
const jwtoken=require("jsonwebtoken");
// const asyncHandler=require('express-async-handler');

require('dotenv').config();



 const protect=async(req,res,next)=>{
    try{
         const token=req.cookies.jwtoken;
       const verifyUser=  jwtoken.verify(token,  process.env.JWT_SECRET );
    
          
        req.user= await Userdb.findById(verifyUser._id).select("-password");
        // console.log(req.user);
       next();
    }
    catch(error){
        res.status(401).send(error);
    }
 }

 

  module.exports = { protect };



