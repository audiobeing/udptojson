/// notes: 
//// check if seriesName and raceIndex already exists
////// if it does provide option to remove or ???????



const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const JSONSocket = require('udp-json');
const { F1TelemetryClient, constants } = require('@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;
const fs = require('fs');
const mongoose = require('mongoose'); 
const db = require("./models"); 
const Data = db.data;
require("dotenv").config({path:".env"}); 
connectDb()
const client = new F1TelemetryClient({ port: 20777 });
var session = "race"
var lightsOutEvent = false; 
var seriesName = null; 
var raceIndex = null; 
var args = process.argv.slice(2); 
var repeatMessage = null; 
var sessionType = 10; 
var sessionTypeBuffer = false; 

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


//// CAPTURE PARICIPANTS DATA PACKET ID 4 ONCE AFTER LIGHTS OUT EVENT()


//// GET LIGHTS OUT EVENT HERE
client.on(PACKETS.event, async (d)=>{
    // m_eventStringCode
    // “LGOT”
    if(sessionTypeBuffer){
        d.type = 'event'
        if(d.m_eventStringCode == "LGOT" || d.m_eventStringCode == "SSTA"){
            d.raceEvent_lightsOut = true; 
            lightsOutEvent = true; 
            console.log("lights out event tagged")
        }
    }
//    saveData(d) 
//    console.log(d)
});
// client.on(PACKETS.motion, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.carSetups, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS, async (d)=>{
//     d.session = "race"
// })
// client.on(PACKETS.lapData, async (d)=>{
//     d.type = "lapData"
//     saveData(d); 
//     console.log(d); 
// });
client.on(PACKETS.session, async (d)=>{
    // saveData(d); 
    if(d.sessionType == sessionType || d.sessionType == sessionType+1){
        sessionTypeBuffer = true; 
        console.log(d); 
    }else{
        sessionTypeBuffer = false; 
    }  
});
client.on(PACKETS.participants, async (d)=>{
    if(sessionTypeBuffer){
        d.gearSession = session; 
        d.type = "participants"
        d.seriesName = seriesName; 
        d.raceIndex = raceIndex; 
        if(lightsOutEvent==true){
            d.lightsOutEvent = true; 
            setTimeout(function(){
                lightsOutEvent = false; 
                console.log("lightsOutEvent changed to false")
            },12000)
            saveData(d); 
            console.log("participants lights out event tagged")
        }
    }
    // console.log(d); 
});
/// 
// client.on(PACKETS.carTelemetry, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.carStatus, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });

client.on(PACKETS.finalClassification, async (d)=>{
    if(sessionTypeBuffer){
        d.gearSession = session; 
        d.seriesName = seriesName; 
        d.raceIndex = raceIndex; 
        d.type = "finalClassification"; 
        console.log(d); 
        saveData(d); 
    }
    
});
// client.on(PACKETS.lobbyInfo, async (d)=>{
//     d.type = "lobbyInfo"
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.carDamage, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.sessionHistory, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });

// to start listening:
client.start();

// and when you want to stop:
// client.stop();

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
        console.log(o.type + " saved datum")
        
        });
    })
}