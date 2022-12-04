const mongoose= require('mongoose');

 var messageSchema=mongoose.Schema({
     
    sender:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"Userdb"
    },
    content:{
           type:String,
           trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chatdb"
    }
    

 })

 const Messagedb=mongoose.model('Messagedb',messageSchema);
 module.exports=Messagedb;