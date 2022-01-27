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
client.on(PACKETS.event, console.log);
// client.on(PACKETS.motion, console.log);
// client.on(PACKETS.carSetups, console.log);
// client.on(PACKETS.lapData, console.log);
// client.on(PACKETS.session, console.log);
// client.on(PACKETS.participants, console.log);
// client.on(PACKETS.carTelemetry, console.log);
// client.on(PACKETS.carStatus, console.log);
client.on(PACKETS.finalClassification, console.log);
// client.on(PACKETS.lobbyInfo, console.log);
// client.on(PACKETS.carDamage, console.log);
// client.on(PACKETS.sessionHistory, console.log);

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
        const d = new Date();
        let utctime = d.getTime();

        var datum = new Data({
            time: utctime, 
            data: {
                test: "testing",
                testi: {a: {b: "k"}}
            }
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
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

}