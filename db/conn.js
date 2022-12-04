const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://akashgupta:Agupta10@cluster0.xentysu.mongodb.net/?retryWrites=true&w=majority"
const connectDB = async()=> {
    try{
        // mongodb connection string
        const con = mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

       console.log('MongoDB connected');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;