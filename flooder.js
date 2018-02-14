const cluster = require('cluster');
const kahoot = require('./kahoot.js/index.js');

let pid = cluster.worker.id;

//console.log(`[HELLO] Worker with PID ${pid} is online!`);

process.on('message', (data) => {
    const gamePin = data.gamePin;
    const name = data.name;

    let kUsr = new kahoot();
    let nextAnswer = Math.round(Math.random() * 3);

    //console.log(`[JOIN] Worker ${pid} joining game...`);
    kUsr.join(gamePin, name);

    kUsr.on('joined', () => {
        console.log(`[JOINED] Worker ${pid} joined game!`);
    });

    kUsr.on('questionStart', (q) => {
        console.log(`[ANSR] Worker ${pid} answering with ${nextAnswer}...`);
        q.answer(nextAnswer);
        nextAnswer = Math.round(Math.random() * 3);
    });

    kUsr.on('finish', () => {
        //console.log(`[DONE] Worker ${pid} got game finished! dying...`);
        kUsr.leave();
        process.exit();
    });

});