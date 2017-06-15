/**
 * Created by pheyvaer on 03.05.17.
 */

let assert = require('chai').assert;
let search = require('../index.js').json.paths;
let results = require('./results-searchpaths.json').results;

describe('SearchPaths', function () {
  it('#1', function () {
    let values = ['pieter', 'heyvaert', '26'];
    let dataObject = {
      persons: [
        {
          name: {
            first: 'pieter',
            last: 'heyvaert'
          },
          age: '26'
        }
      ]
    };

    let result = search(dataObject, values);
    //console.log(JSON.stringify(result));
    //console.log(result);

    assert.deepEqual(result, results[0], 'Paths are incorrect.');
  });

  it('#2', function () {
    let values = ['pieter', 'heyvaert', '26'];
    let dataObject = {
      persons: [
        {
          names: [{
            first: 'pieter',
            last: 'heyvaert'
          }],
          age: '26'
        }
      ]
    };

    let result = search(dataObject, values);
    //console.log(result);

    assert.deepEqual(result, results[1], 'Paths are incorrect.');
  });
});
