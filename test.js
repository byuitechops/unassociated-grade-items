const lsf = require('./listSubFiles.js');
const lsf2 = require('./listSubFilesSync');
const targetDirectory = process.argv[2];

var test;
lsf(targetDirectory,(err, results)=>{test = results});
console.log(test)
