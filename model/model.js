const mongoose=require('mongoose');
const jwtoken= require('jsonwebtoken');
const bcrypt=require('bcryptjs');
require('dotenv').config();
var schema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
       ]
    
});

// generating token
 
 schema.methods.generateAuthToken=async function(req,res){
    try{
        console.log(this._id);
        const token=   jwtoken.sign({_id:this._id.toString()},process.env.JWT_SECRET);
        this.tokens=this.tokens.concat({token:token})
        // console.log(token);
        await this.save();
       return token;
    }
    catch(error){
         res.send(error);
         console.log(error);
    }
  
   
    
    }

    // bcrypt password hiding
    // schema.methods.matchPassword = async function (enteredPassword) {
    //     return await bcrypt.compare(enteredPassword, this.password);
    //   };
      
    //  schema.pre("save", async function (next) {
    //     if (!this.isModified) {
    //       next();
    //     }
      
    //     const salt = await bcrypt.genSalt(10);
    //     this.password = await bcrypt.hash(this.password, salt);
    //   });
      
const Userdb=mongoose.model('Userdb',schema);

module.exports=Userdb;