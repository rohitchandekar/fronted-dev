const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};


let allchats = [
 {
    from : "hrutik",
    to:"samay",
    msg:"send your que ppr",
    created_at : new Date(), //cretae date automatic
},
{
    from : "rohit",
    to:"asif",
    msg:"send your  rsume",
    created_at : new Date(), //cretae date automatic
},
{
    from : "prachi",
    to:"anushka",
    msg:"pick up to me",
    created_at : new Date(), //cretae date automatic
},
{
    from : "madhur",
    to:"gaurav",
    msg:"send your cloths",
    created_at : new Date(), //cretae date automatic
},
{
    from : "harshal",
    to:"karan",
    msg:"drop your meg",
    created_at : new Date(), //cretae date automatic
}
];
//create our model(chats)
Chat.insertMany(allchats);
