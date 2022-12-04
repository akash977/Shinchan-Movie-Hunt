

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
var io=require('socket.io')(server)
const PORT=process.env.PORT||9000;
const path= require('path');

const connectDB=require('./db/conn');
const Userdb=require('./model/model');
const userRoutes=require('./Routes/userRoutes')
const chatRoutes=require('./Routes/chatRoutes')
const messageRoutes=require('./Routes/messageRoutes')

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

// socket.io

  

// io.on('connection',socket=>{
//    let users={}
//    console.log("connected with socket.io");


//    socket.on('send', message=>{
//       socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
//   });


// })


// listening of server on port****
 server.listen(PORT,()=>console.log("server is running at port:",PORT));

 








