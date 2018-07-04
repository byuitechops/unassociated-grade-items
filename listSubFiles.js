/********************************************************************
 * listSubFiles.js
 * returns an array of the paths which lead to every file and sub-file
 * starting from an initial parent directory. 
 * 
 * STATUS: Incomplete
 * 
 * NEXT: -> Catch non-existant targetDirectory path locations
 *       -> Mind the Async when attempting to export the array of files
 *       -> Properly handle non-fatal errors that would otherwise terminate
 *          the program.
 * 
 * NOTE: This program will terminate if it tries to access a file it 
 *       does not have permission to.
 * 
 * Usage:
 * const lsf = require('listSubFiles.js');
 * var array = lsf(target);
 ********************************************************************/

module.exports = (targetDirectory) => {
const fs = require('fs');
const asyncLib = require('async');
// const targetDirectory = `C:\\Users\\ajshiff\\Documents\\git\\d2l-to-canvas\\unassociated-grade-items\\node_modules\\child-development-kit\\factory\\unzipped\\Conversion Test Gauntlet 1\\`;

/********************************************************************
 * 
 ********************************************************************/
function readDirectory(allFiles, directories, getFiles_cb) {
    if (directories.length !== 0) {
        // console.log(directories.length);
        let newDirectories = [];
        directories.forEach(directory => {
            var files = fs.readdirSync(directory);
            // console.log(files);
            files.forEach(file => {
                // console.log(file);
                let fileStat = fs.lstatSync(directory + file);
                let isDirectory = fileStat.isDirectory();
                let isFile = fileStat.isFile();
                if (isDirectory) {
                    newDirectories.push(directory + file + '\\');
                } else if (isFile) {
                    allFiles.push(directory + file);
                } else {
                    console.log("HEY! LOOK AT THIS!!!: " + directory + file);
                    // console.log(fileStat);
                }
            });
            // console.log(newDirectories);
        });
        // console.log(newDirectories);
        directories = newDirectories;
        readDirectory (allFiles, directories, getFiles_cb)
        
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
        // console.log(results.length);
        results.forEach(result => {
            if (true)
            {
                console.log(result);
            }
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
}