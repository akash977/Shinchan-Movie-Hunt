const express =require('express');
const router= express.Router();
const {protect}=require('../middleware/authMiddleware');
const bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Userdb=require('../model/model');
const Chatdb=require('../model/chatmodel');


// creating one to one chat
router.post('/chats',protect,async(req,res)=>{
  
      const {username}=req.body;
     // console.log(username);
      const  User= await Userdb.findOne({userName:username});
      console.log(User);
      const userId =User._id;
      //console.log(userId);

      if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
      }
      var isChat = await Chatdb.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
  .populate("users", "-password")
    .populate("latestMessage");

    isChat = await Userdb.populate(isChat, {
        path: "latestMessage.sender",
        select: "name  email",
      });


      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.user._id, userId],
        };
    
        try {
          const createdChat = await Chatdb.create(chatData);
          const FullChat = await Chatdb.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
          res.status(200).json(FullChat);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      }

});



//fetch id of logged in user
router.get('/getid',protect,async(req,res)=>{
  try {
    
      
        res.status(200).send(req.user._id);
      
  } catch (error) {
   
    res.status(400);

    throw new Error(error.message);
  }
});
// fetch/get all chat for a user
router.get('/allchat',protect,async (req, res) => {
  
    try {
      Chatdb.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await Userdb.populate(results, {
            path: "latestMessage.sender",
            select: "userName email",
          });
       // console.log(results);
          res.status(200).send(results);
        });
    } catch (error) {
     
      res.status(400);

      throw new Error(error.message);
    }
  });
 
  // creating group
  router.post('/groupchats',protect,async (req, res) => {
    var users=new Set;
    
   if(req.body.user1){
    const  User1= await Userdb.findOne({userName:req.body.user1});
       if(User1)
       users.add(User1);
   }
   if(req.body.user2){
    const  User2= await Userdb.findOne({userName:req.body.user2});
       if(User2)
       users.add(User2);
   
}
if(req.body.user3){
  const  User3= await Userdb.findOne({userName:req.body.user3});
  if(User3)
  users.add(User3);
}
if(req.body.user4){
  const  User4= await Userdb.findOne({userName:req.body.user4});
  if(User4)
  users.add(User4);
}
if(req.body.user5){
  const  User5= await Userdb.findOne({userName:req.body.user5});
  if(User5)
  users.add(User5);
}

    if (!users.size || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    
  
    
  
    users.add(req.user);
    var allusers=[];
   
    users.forEach(a => { 
   // console.log(a); 
    allusers.push(a);
    })
    if (allusers.length < 3) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    try {
      const groupChat = await Chatdb.create({
        chatName: req.body.name,
        users: allusers,
        isGroupChat: true,
        
      });
  
      const fullGroupChat = await Chatdb.findOne({ _id: groupChat._id })
        .populate("users", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  




module.exports=router;