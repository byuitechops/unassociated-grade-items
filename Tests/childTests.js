/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');

module.exports = (course, callback) => {
    tap.test('child-template', (test) => {

        test.pass('potato');
        test.pass('tomato');
        test.fail('avacado');

        test.end();
    });

    // Always call the callback in your childTests with just null
    callback(null);
};