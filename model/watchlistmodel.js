const mongoose= require('mongoose');

 var watchlistSchema=mongoose.Schema({
     
   
    id:{
           type:Number,
           trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chatdb"
    }

    

 })

 const Watchlistdb=mongoose.model('Watchlistdb',watchlistSchema);
 module.exports=Watchlistdb;