// import dgram from 'dgram';
const dgram = require("dgram")
const JSONSocket = require('udp-json');

// Listener socket
const socket = dgram.createSocket('udp4');
socket.bind(20777, '192.168.0.16');
const jsonSocket = new JSONSocket(socket)
jsonSocket.on('message-complete', (msg, rinfo) => {
    console.log('Message received', rinfo, msg);
})

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