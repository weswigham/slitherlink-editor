var browserify = require('browserify');
var tsify = require('tsify');
 
browserify()
    .add('index.ts')
    .plugin(tsify)
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(process.stdout);