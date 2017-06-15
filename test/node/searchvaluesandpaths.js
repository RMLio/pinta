/**
 * Created by Pieter Heyvaert.
 * Ghent University - imec - IDLab
 */

let assert = require('chai').assert;
let search = require('../../index.js').json.searchValuesAndPaths;

describe('searchValuesAndPaths', function () {
  it.only('#1', function () {
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

    let expectedResult = [{"path":"$.persons[0].name.first","value":"pieter"},{"path":"$.persons[0].name.last","value":"heyvaert"},{"path":"$.persons[0].age","value":"26"}];
    let result = search(dataObject);
    //console.log(JSON.stringify(result));

    assert.deepEqual(result, expectedResult);
  });
});
