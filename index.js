

const express = require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const session= require("session");
const morgan=require("morgan");
const jwt=require("jsonwebtoken");

const dotenv=require('dotenv');
const app=express();
const http=require('http')
var server=http.createServer(app)

const PORT=process.env.PORT||9000;
const path= require('path');

const connectDB=require('./db/conn');
const Userdb=require('./model/model');
const Chatdb=require('./model/chatmodel');
const Messagedb=require('./model/messagemodel');

const userRoutes=require('./Routes/userRoutes')
const chatRoutes=require('./Routes/chatRoutes')
const messageRoutes=require('./Routes/messageRoutes');
const watchlistRoutes=require('./Routes/watchlistRoutes');

const console = require('console');

 // mongodb connection

 connectDB();
// use cookingParser
 app.use(cookieParser());

 // For parsing application/json
app.use(express.json());


//parse request to body-parser
 app.use(bodyParser.urlencoded({extended:true}));

 //set view engine
 app.set('view engine','ejs');


 app.use('',express.static(path.resolve(__dirname,"")))
 
 

app.get('/',(req,res)=>{
   // res.sendFile(path.join(__dirname, 'index.html'));
   res.render('index');
})

// app.use("/api/user", userRoutes);
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);
app.use(watchlistRoutes);



  



// listening of server on port ****
 server.listen(PORT,()=>console.log("server is running at port:",PORT));



 // socket.io
 const users = {};
 var io=require('socket.io')(server,{
   pingTimeout:60000,
   cors:{
      origin:"http://localhost:9000",
   },
 })


io.on("connection",(socket)=>{
   console.log("coneected to socket.io");
socket.on("setup", (userData)=>{
        socket.join(userData._id);
        users[userData._id]=socket.id;
        socket.emit("connected");
});
socket.on("join chat", (room)=>{
   socket.join(room);
   console.log("User joined Room:"+room);
   
});



socket.on('new message',({m,mes,senderid})=>{
   const  messageInp  = m;
    const chatId=mes.chat._id;
    if (!messageInp || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    console.log( senderid);
   
   
    var newMessage = {
      sender: senderid.id,
      content: messageInp,
      chat: chatId,
    };

   const nwmsg= new Messagedb(newMessage);
   nwmsg.save();
  



   var chat=mes.chat;
  
   if(!chat.users)return console.log("chat.users not defined");
   chat.users.forEach(user => {
    var chat=mes.chat;
   if(user==senderid)return ;
      
   socket.to(users[user]).emit("message recieved",{m:m,userid:user});
   });
})
});

   


