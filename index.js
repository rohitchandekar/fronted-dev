//basic setup
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require('./models/chat.js');
const methodOverride = require('method-override')
const ExpressError = require("./ExpressError");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};


//index route
app.get("/chats",async (req,res)=>{
    try {

        let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs",{chats});
        
    } catch (err) {
        next(err);
        
    }
   

});

//new route //error handilng
app.get("/chats/new",(req,res)=> {
    // throw new ExpressError(404,"Page not found")
    res.render("new.ejs");
   
});


//create route
// app.post("/chats",(req,res)=> {
//    let { from , to , msg} = req.body;
//    let newChat = new Chat({
//     from: from,
//     to:to,
//     msg:msg,
//     created_at:new Date(),
//    });
//    newChat.save().then((res)=>{
//     console.log("chat was save");
//    }).catch((err)=>{
//     console.log(err);
//    });
// //    console.log(newChat);
//    res.redirect("/chats")
// });


//or
app.post("/chats",async (req,res,next)=> {
 try{
      let { from , to , msg} = req.body;
   let newChat = new Chat({
    from: from,
    to:to,
    msg:msg,
    created_at:new Date(),
   });
   await newChat.save();
    res.redirect("/chats");
 } catch(err){
    next(err);
 }
  
  
});


//using  function asyncwrap error handling
function asyncwrap(fn){
    return function (req, res, next){
        fn(req, res, next).catch((err)=> next(err));
    }
}

//new-show Route for backend err not part of fakwwhatsapp//asyc error handling
app.get("/chats/:id", asyncwrap (async (req, res, next)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat) {
        throw new ExpressError(404,"chat not found")
    }
    res.render("edit.ejs", {chat});
}));



// edit route
app.get("/chats/:id/edit",async(req,res)=>{
   try {
     let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
   } catch (err) {
    next(err);
   }
});

//UPDATE ROUTE
app.put("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let {msg:newMsg}= req.body;
    let updatechat = await Chat.findByIdAndUpdate(
    id,{msg:newMsg},
    {runValidators: true, new: true});
    console.log(updatechat);
    res.redirect("/chats");
});


//destry route

app.delete("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let deletechat = await Chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");

});

app.get("/",(req,res)=>{
    res.send("server is working");
});

const handlevalidationErr = (err) => {
    console.log("this was a validation error.please follor rules");
    console.dir(err.message);
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if (err.name === "ValidationError") {
    //    console.log("this was a validation error.please follor rules");
   err = handlevalidationErr(err);
        
    }
    next(err);
});


//error handling  middleware//asyc error handling
app.use((err,req,res,next)=>{
  let {status=500 , message = "Some Error Occured"}  = err;
  res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});


