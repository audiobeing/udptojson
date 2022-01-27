const fs = require('fs');
const mongoose = require('mongoose'); 
const db = require("./models"); 
const Data = db.data;
require("dotenv").config({path:".env"}); 
connectDb()
findData(); 

async function findData(){
    const docs = await Data.find({ "data.m_header.m_packetId": 4 });
    docs.forEach((v,i)=>{
        console.log(v.data.m_participants ); 
        })

    // console.log(JSON.stringify(docs.data.m_participants)); 
}
async function connectDb(){
    db.mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((r) => {
        console.log("Successfully connect to MongoDB.");
        // initiateCarnumbers()
        // setupBot(); 
        
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

}