const mongoose=require('mongoose');


var chatSchema=new mongoose.Schema({
    chatName:{
        type:String,
        required:true
    },
    isGroupChat:{
        type:Boolean,
        default:false   
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Userdb",
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Messagedb",
    },
    
    
});

const Chatdb=mongoose.model('Chatdb',chatSchema);

module.exports=Chatdb;