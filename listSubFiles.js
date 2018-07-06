/********************************************************************
 * listSubFiles.js
 * returns an array of the paths which lead to every file and sub-file
 * starting from an initial parent directory. 
 * 
 * STATUS: Incomplete
 * 
 * NEXT: -> Catch user-given non-existant targetDirectory path locations (WIP)
 *       -> Mind the Async when attempting to export the array of files (DONE)
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
const fs = require('fs');
const path = require('path');
const asyncLib = require('async');

/********************************************************************
 * 
 ********************************************************************/
function readDirectory(allFiles, directories, getFiles_cb) {
    if (directories.length !== 0) {
        let newDirectories = [];
        directories.forEach(directory => {
            try {
                var files = fs.readdirSync(directory);
                var dontCheckDirectory = false;
            } catch(err) {
                console.log('Hrmmm...'); // No permission to look inside this folder
                console.log('dontCheckDirectory = true: ' + directory); // doSkipError is related to having no permission to check file details.
                dontCheckDirectory = true;
                // process.exit(console.log('Terminating program...'));
            }
            if (!dontCheckDirectory) {
                files.forEach(file => {
                    try { 
                        let fileStat = fs.lstatSync(directory + file);
                        var isDirectory = fileStat.isDirectory();
                        var isFile = fileStat.isFile();
                        var doSkipError = false;
                    } catch (err) {
                        // console.log('THIS IS WHY WE CAN\'T HAVE NICE THINGS'); // No permissions to check file details
                        isDirectory = false;
                        isFile = false;
                        doSkipError = true;
                    }
                    if (isDirectory) {
                        newDirectories.push(directory + file + '\\');
                    } else if (isFile) {
                        allFiles.push(directory + file);
                    } else if (doSkipError){
                        // console.log("doSkipError = true: " + directory + file); // doSkipError is related to having no permission to check file details.
                    } else {
                        // Enter Code here if you want to do something about
                        // files found that aren't files or directories
                    }
                });
            }
        });
        // Run readDirectory() until it's exit condition is met in the if/else at the top.
        readDirectory(allFiles, newDirectories, getFiles_cb)
        
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
function getFiles (targetDirectory, getFiles_cb){
    var fileArray = [];
    console.log(path.resolve(targetDirectory));
    var directoryArray = [targetDirectory];
    readDirectory(fileArray, directoryArray, getFiles_cb);
}

/********************************************************************
 * 
 ********************************************************************/
function checkVariables (targetDirectory, checkVars_cb){
    var isDirectory = false;
    var error = null;
    try {
        if (fs.existsSync(targetDirectory)) {
            isDirectory = fs.lstatSync(targetDirectory).isDirectory();
        } 
    } catch (err){
        error = "Something went wrong!\n" + err;
    }
    if (error){
        checkVars_cb(error, null);
    } else if (!isDirectory) {
        error = "The Path you entered does not lead to a directory.";
        checkVars_cb(error, null);
    } else {
        // let absolutePath = path.resolve(targetDirectory);
        // console.log(absolutePath);
        checkVars_cb(null, null);
    }
}

/********************************************************************
 * 
 ********************************************************************/
module.exports = (targetDirectory, stepCallback) => {
    asyncLib.waterfall([
        // (checkVars_cb) => checkVariables(targetDirectory, checkVars_cb),
        (getFiles_cb) => getFiles(targetDirectory, getFiles_cb)
    ], stepCallback);
    
}