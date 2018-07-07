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
 *          the program. (DONE)
 * 
 * NOTE: 
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
                var checkDirectory = true;
            } catch(err) {
                console.log(err)
                console.log('Hrmmm...'); // No permission to look inside this folder
                console.log('checkDirectory = false: ' + directory); // skipDirectoryError is related to having no permission to look inside folder
                checkDirectory = false;
            }
            if (checkDirectory) {
                files.forEach(file => {
                    try { 
                        let fileStat = fs.lstatSync(directory + '\\' + file);
                        var isDirectory = fileStat.isDirectory();
                        var isFile = fileStat.isFile();
                        var doSkipError = false;
                    } catch (err) {
                        // No permissions to check file details
                        // console.log('THIS IS WHY WE CAN\'T HAVE NICE THINGS'); 
                        // console.log(err)
                        isDirectory = false;
                        isFile = false;
                        doSkipError = true;
                    }
                    if (isDirectory) {
                        newDirectories.push(directory + file + '\\');
                    } else if (isFile) {
                        allFiles.push(directory + file);
                    } else if (doSkipError){
                        console.log("doSkipError = true: " + directory + file); 
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
function getFiles (absolutePath, getFiles_cb){
    var fileArray = [];
    var directoryArray = [absolutePath];
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
        let absolutePath = path.resolve(targetDirectory) + '\\';
        checkVars_cb(null, absolutePath);
    }
}

/********************************************************************
 * 
 ********************************************************************/
module.exports = (targetDirectory, stepCallback) => {
    asyncLib.waterfall([
        (checkVars_cb) => checkVariables(targetDirectory, checkVars_cb),
        (absolutePath, getFiles_cb) => getFiles(absolutePath, getFiles_cb)
    ], (err, data) => {
        if (err){
            console.log('The program failed.');
            console.error(err);
        } else {
            stepCallback(null, data);
        }
    });
}