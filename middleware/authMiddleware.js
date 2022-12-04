const Userdb=require('../model/model');
const jwtoken=require("jsonwebtoken");
// const asyncHandler=require('express-async-handler');

require('dotenv').config();

// const protect = asyncHandler(async (req, res, next) => {
//     let token;
  
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         console.log("TOKEN:"+token);
//       try {
//         token = req.headers.authorization.split(" ")[1];
       
//         //decodes token id
//         const decoded = jwt.verify(token,  process.env.JWT_SECRET );
        
//         req.user = await Userdb.findById(decoded.id).select("-password");
  
//         next();
//       } catch (error) {
//         res.status(401);
//         throw new Error("Not authorized, token failed");
//       }
//     }
    

//     if (!token) {
//       res.status(401);
//       throw new Error("Not authorized, no token");
//     }
//   });

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



