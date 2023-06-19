const express =require('express');
const router= express.Router();
const {protect}=require('../middleware/authMiddleware');
const bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Userdb=require('../model/model');
const Chatdb=require('../model/chatmodel');
const Messagedb=require('../model/messagemodel');
const Watchlistdb=require('../model/watchlistmodel');
router.get('/watchlist/:chatid',protect,async (req, res) => {
     
      try {
        const movies = await Watchlistdb.find(  {chat:req.params.chatid} )

        res.render('watchlist',{movies:movies,chatid:req.params.chatid}
         )} catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    })
    
router.get('/home/:chatid',protect,async (req, res) => {
       
         try {
           res.render('home',{chatid:req.params.chatid}
            )} catch (error) {
           res.status(400);
           throw new Error(error.message);
         }
       })

router.post('/watchlist',protect,async (req, res) => {
        const  movieid  = req.query.movieid;
         const chatId=req.query.chatid;
     
        if (!movieid || !chatId) {
          console.log("Invalid data passed into request");
          return res.sendStatus(400);
        }
      
        var newMovie = {
          
          id: movieid,
          chat: chatId,
        };
      
        try {
          var movie = await Watchlistdb.create(newMovie);
          console.log("hii");
          movie = await movie.populate("chat");
        //   const movies = await Watchlistdb.find(  {chat:chatId} )
          
         
        } catch (error) {
         
          res.status(400);
          throw new Error(error.message);
        }
      });
         
      router.get('/watchlist',protect,async (req, res) => {
        const  movieid  = req.query.movieid;
         const chatId=req.query.chatid;
     
        if (!movieid || !chatId) {
          console.log("Invalid data passed into request");
          return res.sendStatus(400);
        }
      
        
      
        try {
         
         
         
          const movies = await Watchlistdb.find(  {chat:chatId} )
          console.log("m"+movies);
          res.render('watchlist',{chatid:chatId,movies:movies})
         
        } catch (error) {
         
          res.status(400);
          throw new Error(error.message);
        }
      });
         


    module.exports=router;