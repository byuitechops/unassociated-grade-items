/*eslint-env node, es6*/

/* Module Description */

/* Put dependencies here */

/* Include this line only if you are going to use Canvas API */
// const canvas = require('canvas-wrapper');


module.exports = (course, stepCallback) => {

    console.log('Desmond the moon bear!');

    /* You should never call the stepCallback with an error. We want the
    whole program to run when testing so we can catch all existing errors */

    stepCallback(null, course);
};
