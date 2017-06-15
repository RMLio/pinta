/**
 * Created by pheyvaer on 03.05.17.
 */

let assert = require('chai').assert;
let search = require('../../index.js').json.iteratorAndPaths;
let results = require('./results-search.json').results;

describe('Search', function () {
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

    assert.equal(result.iterator, results[0].iterator, 'Iterator is incorrect.');
    assert.deepEqual(result.paths, results[0].paths, 'Paths are incorrect.');
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

    assert.equal(result.iterator, results[1].iterator, 'Iterator is incorrect.');
    assert.deepEqual(result.paths, results[1].paths, 'Paths are incorrect.');
  });

  it('#3', function () {
    let values = ['AAA'];
    let dataObject = {
      content: [
        {Author: 'K. I.', title: 'AAA'},
        {Author: 'Z. D.', title: 'BBB'}
      ]
    };

    let result = search(dataObject, values);
    //console.log(result);

    assert.equal(result.iterator, results[2].iterator, 'Iterator is incorrect.');
    assert.deepEqual(result.paths, results[2].paths, 'Paths are incorrect.');
  });

  it('#4', function () {
    let values = [ '0'];
    let dataObject = { persons:
      [ { ID: 0, name: 'John', age: '30', friend_id: 1 },
        { ID: 1, name: 'James', age: '25', friend_id: 2 } ] }
    ;

    let result = search(dataObject, values);
    //console.log(result);

    assert.equal(result.iterator, results[3].iterator, 'Iterator is incorrect.');
    assert.deepEqual(result.paths, results[3].paths, 'Paths are incorrect.');
  });
});
