const kahoot = require('./kahoot.js/index.js');
const cluster = require('cluster');
const cla = require('command-line-args');
const ascii = require('cool-ascii-faces');

let flags = [
    { name: 'count', alias: 'c', type: Number },
    { name: 'pin', type: Number }
]

let args = cla(flags);
let processCount = args.count;
let gamePin = args.pin;

if(!processCount){
    console.log(`[ERROR] You must provide an amount of bots with --count [count]`);
    process.exit(2);
}

if(!gamePin){
    console.log(`[ERROR] You must provide a game pin with --pin [pin]`);
    process.exit(2);
}

console.log(`[INFO] Spawning ${processCount} children...`);

cluster.setupMaster({
    exec: `${__dirname}/flooder.js`
});

for(let i = 0; i < processCount; i++){
    //console.log(`[INFO] Spawning process ${i}...`);
    let worker = cluster.fork();
    worker.send({ gamePin: gamePin, name: ascii() });
}

cluster.on('exit', (worker, code, sig) => {
    console.log(`[DIED] Worker ${worker.id} died...`);
});