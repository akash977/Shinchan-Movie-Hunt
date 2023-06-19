const express =require('express');
const router= express.Router();
const {protect}=require('../middleware/authMiddleware');
const bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Userdb=require('../model/model');
const Chatdb=require('../model/chatmodel');
const Messagedb=require('../model/messagemodel');







//@description     Get all Messages


router.get('/newMessage/:chatid',protect,async (req, res) => {
  //  router.get('/allMessage',protect,async (req, res) => {
    try {
     // const chatId=req.params.chatid;
      const messages = await Messagedb.find(  {chat:req.params.chatid} )
      .populate("sender", "userName email")
      .populate("chat");
      
        
      const chats = await Chatdb.findOne(  {_id:req.params.chatid} ).populate("users");
      const userData = await Userdb.findOne(  {_id:req.user._id} );
      
   
     var chatname;
     var grpchat=0;
     if(chats.isGroupChat){
       chatname=chats.chatName;
       grpchat=1;
     }
     if(!chats.isGroupChat){
      const Users0 = await Userdb.findOne(  {_id:chats.users[0]} );
      const Users1 = await Userdb.findOne(  {_id:chats.users[1]} );
      const Users2 = await Userdb.findOne(  {_id:req.user._id} );
      
     
        if(Users0.userName==Users2.userName){
     
        const Users = await Userdb.findOne(  {_id:chats.users[1]} );
      
        chatname=Users.userName;
      }
      
        if(Users1.userName==Users2.userName){
      
        const Users = await Userdb.findOne(  {_id:chats.users[0]} );
        chatname=Users.userName;
      }
      
      
    }

     const  chatnames={
        chatname:chatname
    }
  
      const ids={id:req.user._id}
      
     console.log(chats);
     
      res.render('message',{messages:messages,ids:ids,chatnames:chatname,userData:userData,chatid:req.params.chatid,chats:chats,grpchat:grpchat}
       )} catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  })

  
  //@description     Create New Message

  router.post('/newMessage/:chatid',protect,async (req, res) => {
    const { messageInp } = req.body;
    const chatId=req.params.chatid;
 
    if (!messageInp || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: messageInp,
      chat: chatId,
    };
  
    try {
      var message = await Messagedb.create(newMessage);
     
      message = await message.populate("sender");
  
      message = await message.populate("chat");
    
      message = await Userdb.populate(message, {
        path: "chat.users",
        select: "userName email",
      });
    
      await Chatdb.findByIdAndUpdate(req.params.chatid, { latestMessage: message });
      // res.render('message');
    
      //  res.json(message);
    } catch (error) {
     
      res.status(400);
      throw new Error(error.message);
    }
  });



  

module.exports=router;