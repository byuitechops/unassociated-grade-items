const fs = require('fs');
const asyncLib = require('async');
// const targetDirectory = `C:\\Users\\ajshiff\\Documents\\git\\d2l-to-canvas\\unassociated-grade-items\\node_modules\\child-development-kit\\factory\\unzipped\\Conversion Test Gauntlet 1\\`;
const targetDirectory = process.argv[2];
const phrase = 'grade';
//closures

/********************************************************************
 * 
 ********************************************************************/
function readDirectory(allFiles, directories, getFiles_cb) {
    if (directories.length !== 0) {
        console.log(directories.length);
        let newDirectories = [];
        directories.forEach(directory => {
            let files = fs.readdirSync(directory);
            // console.log(files);
            files.forEach(file => {
                if(file.includes('.')) {
                    allFiles.push(directory + file);
                } else {
                    newDirectories.push(directory + file + '\\');
                }
            });
            // console.log(newDirectories);
        });
        console.log(newDirectories)
        directories = newDirectories;
        readDirectory(allFiles, directories, getFiles_cb)
    } else {
        getFiles_cb(null, allFiles);
    }
}

/********************************************************************
 * filesInDirectory() utilizes a publicly defined targetDirectory 
 * then fetches all items in that directory and organizes them into
 * two arrays one for files and one for subdirectories. An object of
 * those arrays is passed to the next function in the waterfall.
 ********************************************************************/
function getFiles (getFiles_cb){
    var fileArray = [];
    var directoryArray = [targetDirectory];
    readDirectory(fileArray, directoryArray, getFiles_cb);
}



/********************************************************************
 * 
 ********************************************************************/
var finalResults_cb = function(err, results){
    if (err) {
        console.error(err);
    } else {
        // console.log(results);
        results.forEach(result => {
            // console.log(result);
        })
    }
}

/********************************************************************
 * 
 ********************************************************************/
function main (){
    asyncLib.waterfall([
        getFiles
    ], finalResults_cb);
}

/********************************************************************
 * 
 ********************************************************************/
main();