# pinta-json

This `npm` module provides two functions:
- search for the paths of an array of values in a JSON object;
- search for the paths and the common iterator of an array of values in a JSON object.

## Usage
```JavaScript
let pinta = require('pinta-json');

//search for paths
let values = ['pieter', 'heyvaert', '26'];
let dataObject = {
  persons: [{
    name: {
      first: 'pieter',
      last: 'heyvaert'
   },
   age: '26'
  }]
};

let result = pinta.paths(dataObject, values);
/**
* result --> [
*   {"path":"$.persons[0].name.first","value":"pieter"},
*   {"path":"$.persons[0].name.last","value":"heyvaert"},
*   {"path":"$.persons[0].age","value":"26"}
* ]
**/


//search iterator and corresponding paths
let values = ['pieter', 'heyvaert', '26'];
let dataObject = {
  persons: [{
    name: {
      first: 'pieter',
      last: 'heyvaert'
   },
   age: '26'
  }]
};

result = pinta.iteratorAndPaths(dataObject, values);
/**
* result --> {
*   "iterator":"$.persons[*]",
*   "paths":[
*     {"path":"name.first","value":"pieter"},
*     {"path":"name.last","value":"heyvaert"},
*     {"path":"age","value":"26"}
*   ]
* }
**/
```

## License
MIT