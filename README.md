# pinta

Pinta is a JavaScript library provides two core functions:
- search for the paths of an array of values in a JSON object;
- search for the paths and the common iterator of an array of values in a JSON object.

Pinta is available for Node.js and the browser.

## Usage

### Node.js
```JavaScript
let pinta = require('pinta');

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

/**
* set the log level
* default: 'error'
* options: 'error', 'warn', 'info', 'verbose', 'debug', and 'silly' 
*/
pinta.setLogLevel('debug');
```

### Browser

## License
The pinta library is written by [Pieter Heyvaert](https://pieterheyvaert.com/research/).

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and released under **TODO**.