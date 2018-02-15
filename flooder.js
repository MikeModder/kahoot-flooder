const cluster = require('cluster');
const kahoot = require('./kahoot.js/index.js');
const shortid = require('shortid');

let pid = cluster.worker.id;

//console.log(`[HELLO] Worker with PID ${pid} is online!`);

process.on('message', (data) => {
    const gamePin = data.gamePin;
    const name = shortid.generate();

    let kUsr = new kahoot();
    let nextAnswer = Math.round(Math.random() * 3);
    let nextDelay = Math.round(Math.random() * 3);

    //console.log(`[JOIN] Worker ${pid} joining game...`);
    kUsr.join(gamePin, name);

    kUsr.on('joined', () => {
        console.log(`[JOINED] Worker ${pid} joined game!`);
    });

    kUsr.on('questionStart', (question) => {
        console.log(`[ANSR] Worker ${pid} answering with ${nextAnswer} after ${(nextDelay * 1000) + 1}s delay...`);
        kUsr.answerQuestion(nextAnswer)
            .then(() => {
                console.log('[INFO] Answered successfully!');
            })
            .catch(e => {
                console.log(`[ERR] Error answering question: ${e}`);
                process.exit(45);
            });
    });

    kUsr.on('finish', () => {
        //console.log(`[DONE] Worker ${pid} got game finished! dying...`);
        kUsr.leave();
        process.exit(5);
    });

});