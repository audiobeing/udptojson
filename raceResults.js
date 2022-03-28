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
var seriesName = null; 
var raceIndex = null; 
require("dotenv").config({path:".env"}); 
connectDb()
findData(); 
var todaysDate = formatDate(new Date()); 

var args = process.argv.slice(2); 
if(args.length == 0){
    var m = "NO ARGUMENTS PASSED!!!!"; 
    for(var i=0; i<100; i++){
        m+="-"
    }
    console.log(m)
}else if(args.length !=2){
    var m = "INCORRECT NUMBER OF ARGUMENTS PASSED!!!!"; 
    
    for(var i=0; i<100; i++){
        m+="-"
    }
    console.log("ERROR: INCORRECT NUMBER OF ARGUMENTS PASSED!!!!",args.length, "arguments passed - require 2 - series name and race index: ", args, m )
}else{
    seriesName = args[0]; 
    raceIndex = args[1]; 
    var m = `SERIES NAME: ${seriesName}, RACE INDEX: ${raceIndex} `; 
    for(var i=0; i<100; i++){
        m+="-"
    }
    console.log(m)
}

async function findData(){
    //// get midnight previous
    var date = new Date(); 
    var finalClassification = await Data.find({$and: [{"data.type": "finalClassification"}, {"data.seriesName": seriesName}, {"data.raceIndex": raceIndex}]}); //, {"time": {$gte : date}} { "data.gearSession": "race" }, 
    
    
    console.log("FINAL CLASSIFICATION "+new Date(finalClassification.time), finalClassification)

    finalClassification = finalClassification[1].data.m_classificationData
    
    var participants = await Data.find({$and: [{"data.type": "participants"}, {"data.lightsOutEvent": true}, {"data.seriesName": seriesName}, {"data.raceIndex": raceIndex}]});  /// {"time": {$gte : date}},
    console.log("PARTICIPANTS", participants)
   
    participants = participants[1].data.m_participants
    
   
    var carNumbers = []; /// ordered array 
    participants.forEach((v,i)=>{
        if(v.m_raceNumber != 0){
            carNumbers.push(v.m_raceNumber)
        }
    })
    console.log("carNumbers",carNumbers)
    const numberNames = await Racer.find({"number": {$in: carNumbers}})
  
        for(var i=0; i<numberNames.length; i++){
            var index = carNumbers.indexOf(numberNames[i].number);
            finalClassification[index].i = i+1; 
            finalClassification[index].carNumber = numberNames[i].number; 
            finalClassification[index].nickName = numberNames[i].nickName; 
            finalClassification[index].discordId = numberNames[i].discordId; 
        }

        storeData(finalClassification, __dirname+"/finalClassificationFormat_"+todaysDate+".json"); 


    

    db.mongoose.connection.close()
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
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
function formatDate(date) {
    return (
        [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        ].join('-') +
        '_' +
        [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}