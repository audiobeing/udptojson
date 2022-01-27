const fs = require('fs');
const mongoose = require('mongoose'); 
const db = require("./models"); 
const Data = db.data;
require("dotenv").config({path:".env"}); 
connectDb()
findData(); 

async function findData(){
    const docs = await Data.find({ "data.m_header.m_packetId": 4 });
    //  scrub throught the arrua for:
    //  if aicontrolled is equal to 1; printit
    //  else:  fuck it
    var pruned = []; 
    docs.forEach((v,i)=>{
        var mess = v.data.m_participants
        var result = mess.filter(fil)
        pruned.push(result)
        console.log(result); 
        }); 

    storeData(pruned, __dirname+"/fileName.json")
    // console.log(JSON.stringify(docs.data.m_participants)); 
}

function storeData(data, path){
        try {
          fs.writeFileSync(path, JSON.stringify(data))
        } catch (err) {
          console.error(err)
        }
}


function fil(d){
    if(d.m_aiControlled ==  1){
        return d
    }
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
function storeData(data, path){
    try {
      fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
      console.error(err)
    }
}