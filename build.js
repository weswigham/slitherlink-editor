var browserify = require('browserify');
var tsify = require('tsify');
var watchify = require('watchify');
var fs = require('fs');
 
var b = browserify({cache: {}, packageCache: {}})
    .add('index.ts')
    .plugin(tsify, require("./tsconfig.json").compilerOptions)
    .on('error', function (error) { console.error(error.toString()); })
    .on('update', output)
    .on('log', function(msg) { console.log(msg) });

var b2 = browserify({cache: {}, packageCache: {}})
    .add('worker.ts')
    .plugin(tsify, require("./tsconfig.json").compilerOptions)
    .on('error', function (error) { console.error(error.toString()); })
    .on('update', outputWorker)
    .on('log', function(msg) { console.log(msg) });

if (process.argv[2] === "watch") {
    console.log("Commencing watching...");
    b.plugin(watchify);
    b2.plugin(watchify);
    const server = require("child_process").exec("live-server");
    server.stderr.pipe(process.stderr);
    server.stdout.pipe(process.stdout);
}

output();
outputWorker();

function output() {
    b.bundle().pipe(fs.createWriteStream('dist/index.js'));
}

function outputWorker() {
    b2.bundle().pipe(fs.createWriteStream('dist/worker.js'));
}