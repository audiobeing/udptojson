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

// client.on(PACKETS.event, async (d)=>{
//    saveData(d) 
//    console.log(d)
// });
// client.on(PACKETS.motion, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.carSetups, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
client.on(PACKETS.lapData, async (d)=>{
    d.type = "lapData"
    saveData(d); 
    console.log(d); 
});
// client.on(PACKETS.session, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
client.on(PACKETS.participants, async (d)=>{
    d.type = "participants"
    saveData(d); 
    console.log(d); 
});
// client.on(PACKETS.carTelemetry, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
// client.on(PACKETS.carStatus, async (d)=>{
//     saveData(d); 
//     console.log(d); 
// });
client.on(PACKETS.finalClassification, async (d)=>{
    d.type = "finalClassification"; 
    saveData(d); 
    console.log(d); 
});
client.on(PACKETS.lobbyInfo, async (d)=>{
    d.type = "lobbyInfo"
    saveData(d); 
    console.log(d); 
});
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
        console.log("saved datum")
        
        });
    })
}