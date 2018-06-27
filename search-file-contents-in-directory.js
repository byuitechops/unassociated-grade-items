const fs = require('fs');
const asyncLib = require('async');
const targetDirectory = `C:\\Users\\ajshiff\\Documents\\git\\d2l-to-canvas\\unassociated-grade-items\\node_modules\\child-development-kit\\factory\\unzipped\\Conversion Test Gauntlet 1\\`;
const phrase = 'grade';
//closures

/********************************************************************
 * filesInDirectory() relies on closures to allow a directoryLocation
 * to be utilized by a function that will be used in the main waterfall.
 * It fetches all items in a given directory and organizes them into two
 * arrays of files and subdirectories. An object of those arrays is passed
 * to the next function in the waterfall.
 ********************************************************************/
// filesInDirectory = function (directoryLocation) {
    // return 
    function filesInDirectory (getFiles_cb){
        var fileArray = [];
        var directoryArray = [];
        fs.readdir(targetDirectory, function(err, files){
            if (err){
                getFiles_cb(err, files);
            } else {
                files.forEach(function(file){
                    if(file.includes('.')) {
                        fileArray.push(file);
                    } else {
                        directoryArray.push(file);
                    }
                });
            }
            // console.log(fileArray + '\n' + directoryArray)
            getFiles_cb(null, {files: fileArray, directories: directoryArray});
        });
    }
// }

/********************************************************************
 * fetchSubFiles() recieves the initial collection of files and directories
 * and continues to open sub-directories and record paths to all possible files
 * and moves the paths to those children files off of the 'directories' property of
 * the directory object onto the 'files' property with the full extension path.
 ********************************************************************/
var fetchSubFiles = function (directory, next) {
    var fileArray = [];
    var directoryArray = [];
    var subFileArray = [];
    var subDirectoryArray = [];

    // Consider using asyncLib.series here to handle async order


    directory.directories.map( (folder) => {
        fs.readdir(targetDirectory + folder, function(err, files){
            if (err){
                getFiles_cb(err, files);
            } else {
                files.forEach(function(file){
                    if(file.includes('.')) {
                        subFileArray.push(folder + '\\' + file);
                    } else {
                        subDirectoryArray.push(folder + '\\'+ file);
                    }
                });
            }
            subFileArray.forEach(newFile => {directory.files.push(newFile)});
            subFileArray = [];
            subDirectoryArray.forEach(newDirectory => {directory.directories.push(newDirectory)});
            subDirectoryArray = [];
            // directory.files.forEach(thing => {console.log(thing)}) // Make sure files are being recorded correctly
            // directory.directories.forEach(thing => {console.log(thing)}) // Make sure directories are being recorded correctly
        });
    });
    // directory.files.forEach(thing => {console.log(thing)}) // Make sure files are being recorded correctly
    // directory.directories.forEach(thing => {console.log(thing)}) // Make sure directories are being recorded correctly
}

/********************************************************************
 * 
 ********************************************************************/
var finalResults_cb = function(err, results){
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
}

/********************************************************************
 * 
 ********************************************************************/
function main (){
    asyncLib.waterfall([
        filesInDirectory,
        fetchSubFiles
    ], finalResults_cb);
}

/********************************************************************
 * 
 ********************************************************************/
main();