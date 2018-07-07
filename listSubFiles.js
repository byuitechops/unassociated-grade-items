/********************************************************************
 * listSubFiles.js
 * Sends an array of file paths to the parent function starting from 
 * an initial directory.
 * 
 * Usage:
 * const lsf = require('./listSubFiles.js');
 * var array;
 * lsf(targetDirectory, (err, results) => {array = results});
 ********************************************************************/
// Declare Dependancies
const fs = require('fs');
const path = require('path');
const asyncLib = require('async');

/********************************************************************
 * readDirectory() starts in an initial direcotory and sorts files into
 * two arrays, one for directories and one for documents. Any file encoutered
 * that doesn't have read permission or doesn't meet those qualifications is
 * discarded. Documents are sorted into an array and remembered between searches.
 * The array of directories is reset every loop.
 ********************************************************************/
function readDirectory(allFiles, directories, getFiles_cb) {
    if (directories.length !== 0) { // Are there any sub-directories to search through?
        let newDirectories = [];
        directories.forEach(directory => {
            try {
                var files = fs.readdirSync(directory);
                var checkDirectory = true;
            } catch(err) {
                // Something went wrong when trying to read that directory
                console.log('checkDirectory = false: ' + directory);
                console.log(err)
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
                        console.log(err)
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
 * getFiles() gives an overhead summary of what is trying to be
 * accomplished in the this step of the waterfall.
 ********************************************************************/
function getFiles (absolutePath, getFiles_cb){
    var fileArray = [];
    var directoryArray = [absolutePath];
    readDirectory(fileArray, directoryArray, getFiles_cb);
}

/********************************************************************
 * checkVariables() checks the targetDirectory to make sure it is 
 * a directory and not something else, and exists. If something goes
 * wrong, the error is returned which is handled in the parent module
 * in the stepCallback. If everything goes right, then the absolutePath
 * to the targetDirectory is passed into the next callback in the waterfall.
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
    ], stepCallback);
}