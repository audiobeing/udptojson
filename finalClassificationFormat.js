const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const JSONSocket = require('udp-json');
const { F1TelemetryClient, constants } = require('@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;
const fs = require('fs');
const mongoose = require('mongoose'); 
const db = require("./models"); 
const Data = db.data;
const Racer = db.racer; 
require("dotenv").config({path:".env"}); 
connectDb()
findData(); 

async function findData(){
    //// get midnight previous
    var date = new Date(); 
    var dateRef  = date.getTime(); 
    date.setUTCHours(0);
    date = date.toUTCString()
    date = Date.parse(date)
    console.log(dateRef, date); 

    /// get the last race finalClassification
    var finalClassification = await Data.findOne({$and: [{ "data.gearSession": "race" }, {"data.type": "finalClassification"}, {"time": {$gte : date}}]});
    finalClassification = finalClassification.data.m_classificationData
    // console.log(JSON.stringify(finalClassification, null, 2))

    /// get the first participant data for race
    var participants = await Data.findOne({$and: [{ "data.gearSession": "race" }, {"data.type": "participants"}, {"time": {$gte : date}}]});
    participants = participants.data.m_participants
    // console.log(JSON.stringify(participants, null, 2))
    
    var carNumbers = []; /// ordered array 
    participants.forEach((v,i)=>{
        if(v.m_raceNumber != 0){
            carNumbers.push(v.m_raceNumber)
        }
    })
    console.log("carNumbers",carNumbers)
    // console.log(carNumbers, carNumbers.length)
    const numberNames = await Racer.find({"number": {$in: carNumbers}})
    // console.log(numberNames)
    
    for(var i=0; i<numberNames.length; i++){
        var index = carNumbers.indexOf(numberNames[i].number);
        finalClassification[index].carNumber = numberNames[i].number; 
        finalClassification[index].nickName = numberNames[i].nickName; 
        finalClassification[index].discordId = numberNames[i].discordId; 
    }
    
    console.log(finalClassification)
    /// get the racers by f1 carnumber from db

    storeData(finalClassification, __dirname+"/finalClassificationFormat.json"); 
    
    

    // if session it is a race
    /// if you don't have the participants data get it put in variable
    /// get the final classification 
    db.mongoose.connection.close()
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
function storeData(data, path){
    try {
      fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
      console.error(err)
    }
}
async function saveData(o){
    var o = JSON.parse(JSON.stringify(o,(key,value)=>{
        if(typeof value === 'bigint'){
            //console.log("yep")
            return value.toString(); 
            // console.log("yep")
        }else{
            //console.log("stringipoo---no")
            return value
        }
    }))
    const d = new Date();
    let utctime = d.getTime();
    var datum = new Data({
        time: utctime, 
        data: o
    })
    datum.save((err,datum)=>{
        if (err) {
        console.log(err); 
        }
        datum.save(err => {
        if (err) {
            console.log(err)
        }
        mess = "was added to db"
        console.log("saved datum")
        
        });
    })
}