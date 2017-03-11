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

output();

function output() {
    b.bundle().pipe(fs.createWriteStream('dist/index.js'));
}