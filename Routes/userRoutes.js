const express =require('express');


const Userdb=require('../model/model');
const {protect}=require('../middleware/authMiddleware');
const jwtoken=require("jsonwebtoken");
const router= express.Router();
const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const cookieParser= require('cookie-parser');
// use cookingParser
router.use(cookieParser());

// router for register
router.post('/register',async(req,res)=>{
    try{
        const user=new Userdb({
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password   
        })
    // token generation
        const token= await user.generateAuthToken();
        console.log("token:"+token);
        // store token on cookie
       res.cookie("jwtoken"
       ,token,{
        expires: new Date(Date.now()+25892000000),
        httpOnly:true
    });
         const registered= await user.save();
      
         res.render('index');
    }
    catch(error){
           res.status(400).send(error);
    }
})

      
// router for login
router.post('/login',async(req,res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;

        const username= await Userdb.findOne({userName:userName});
      
          
       //  console.log(username);
    
    if(password==username.password){
      // generate token
       const token= await username.generateAuthToken();
       console.log("token:"+token);
     // store token on cookie
     res.cookie("jwtoken",token,{
        expires: new Date(Date.now()+25892000000),
        httpOnly:true,
       

    });
   
      res.render('chat');
      
    }
  
    else{
       res.send("invalid login details");
    }
 
   }
   catch(error){
    res.status(400).send("invalid login details");
   }
})

  // router for search autocomplete
  router.get('/autocomplete',protect, function(req, res, next) {
  
    var regex= new RegExp(req.query["term"],'i');
   
    var employeeFilter =Userdb.find({userName:regex},{'userName':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    employeeFilter.exec(function(err,data){
  
  
  var result=[];
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(user=>{
         let obj={
           id:user._id,
           label: user.userName
         };
         //console.log(req.user._id+user._id);
        // if(req.user._id==user._id){
          
          result.push(obj);
        // }
        
       });
  
     }
   
     res.jsonp(result);
  }
  
    });
  
  });
  



  //       router.get('/autocomplete',protect,  async (req, res) => {
        
  //   const keyword = req.query.search
  //     ? {
  //         $or: [
  //           { userName: { $regex: req.query.search, $options: "i" } },
  //           //  { email: { $regex: req.query.search, $options: "i" } },
  //         ],
  //       }
  //     : {};
    
  //   const users = await Userdb.find(keyword).find({ _id: { $ne: req.user._id } });
  
  //       var userNames=[];
  //   users.forEach(myFunction);
   
  //   function myFunction(item) {
  //     let obj={
  //       id:item._id,
  //       label:item.userName
  //     }
  //   userNames.push(obj);
  //   }


  //   res.json(userNames);
  //  console.log(userNames);

  //  // res.send(userNames);
  // });


 



module.exports=router;