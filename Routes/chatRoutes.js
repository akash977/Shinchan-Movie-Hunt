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
      console.log(username);
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


// fetch/get all chat for a user

router.get('/allchat',protect,async (req, res) => {
  
    try {
      Chatdb.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await Userdb.populate(results, {
            path: "latestMessage.sender",
            select: "userName email",
          });
        
          res.status(200).send(results);
        });
    } catch (error) {
     
      res.status(400);

      throw new Error(error.message);
    }
  });
 
  // creating group
  router.post('/chats/group',protect,async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  
// rename a group
router.put('/chats/rename',protect,async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chatdb.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

//     Remove user from Group

router.put('/chats/remove',protect,async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chatdb.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

  //  Add user to Group 

router.put('/chats/add',protect ,async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chatdb.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports=router;