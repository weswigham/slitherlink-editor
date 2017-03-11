var browserify = require('browserify');
var tsify = require('tsify');
var watchify = require('watchify');
 
var b = browserify({cache: {}, packageCache: {}})
    .add('index.ts')
    .plugin(tsify)
    .plugin(watchify)
    .on('error', function (error) { console.error(error.toString()); })
    .on('update', output)
    .on('log', function(msg) { console.log(msg) });

var b2 = browserify({cache: {}, packageCache: {}})
    .add('worker.ts')
    .plugin(tsify)
    .plugin(watchify)
    .on('error', function (error) { console.error(error.toString()); })
    .on('update', outputWorker)
    .on('log', function(msg) { console.log(msg) });

output();
outputWorker();

function output() {
    b.bundle().pipe(fs.createWriteStream('dist/index.js'));
}

function outputWorker() {
    b2.bundle().pipe(fs.createWriteStream('dist/worker.js'));
}