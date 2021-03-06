const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const JSONSocket = require('udp-json');
const { F1TelemetryClient, constants } = require('@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;
const fs = require('fs');
const mongoose = require('mongoose'); 


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





// Listener socket
// const socket = dgram.createSocket('udp4');
// socket.bind(20777);
// const jsonSocket = new JSONSocket(server)


// server.on('error', (err) => {
//   console.log(`server error:\n${err.stack}`);
//   server.close();
// });
// jsonSocket.on('message-complete', (msg, rinfo) => {
//     console.log('Message received', rinfo, msg);
// })
// jsonSocket.on('message-error', (e) => {
//     console.log('Error', e);
// });
// jsonSocket.on('message-timeout', (e) => {
//     console.log('Error', e);
// });
// // server.on('message', (msg, rinfo) => {
// //   console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
// // });

// server.on('listening', () => {
//   const address = server.address();
//   console.log(`server listening ${address.address}:${address.port}`);
// //   console.log(F1)
// });

// server.bind(20777);



// import dgram from 'dgram';
// const dgram = require("dgram")
// const JSONSocket = require('udp-json');

// Listener socket
// const socket = dgram.createSocket('udp4');
// socket.bind(20777, '127.0.0.1');
// const jsonSocket = new JSONSocket(socket)
// jsonSocket.on('message-complete', (msg, rinfo) => {
//     console.log('Message received', rinfo, msg);
// })

// Sender socket
// const socket2 = dgram.createSocket('udp4');
// const jsonSocket2 = new JSONSocket(socket2, {maxPayload: 496, timeout: 1000});
// jsonSocket2.send({ dummy: 'Dummy Text' }, 56554, '127.0.0.1', (e) => {
//     if (e) {
//         console.log('error', e);
//         return;
//     }
//     console.log('Message sent');
// });