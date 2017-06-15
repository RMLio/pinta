/**
 * Created by pheyvaer on 03.05.17.
 */

let jsonpath = require('jsonpath');
let logger = require('./logger.js').logger;

function search(dataObject, values) {
  let iterator = '';

  let valuesAndPaths = _searchPaths(dataObject, values);
  //console.log(valuesAndPaths);
  let paths = valuesAndPaths.map(function (value) {
    return value.path;
  });

  if (paths.length > 0) {
    if (paths.length > 1) {
      let currentPath = paths[0];
      let i = 0;

      while (i < currentPath.length && isFirstLetter(paths, currentPath[i])) {
        iterator += currentPath[i];
        removeFirstLetter(paths);
        i++;
      }

      //remove iterator from path
      valuesAndPaths.forEach(function (v) {
        v.path = v.path.substr(iterator.length);
        v.path = _useArrayPath(dataObject, v.path);
      });
    } else {
      let last = valuesAndPaths[0].path.lastIndexOf('.');

      if (last !== -1) {
        iterator = valuesAndPaths[0].path.substr(0, last);
        valuesAndPaths[0].path = valuesAndPaths[0].path.substr(last + 1);
      }
    }

    if (iterator[iterator.length - 1] === '.') {
      iterator = iterator.substr(0, iterator.length - 1);
    }

    iterator = _useArrayPath(dataObject, iterator);

    if (iterator === '') {
      iterator = undefined;
    }
  } else {
    iterator = undefined;
    valuesAndPaths = [];
  }

  return {
    iterator: iterator,
    paths: valuesAndPaths
  };
}

function removeFirstLetter(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].substr(1);
  }
}

function isFirstLetter(arr, letter) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined || arr[i] === '' || arr[i][0] !== letter) {
      return false;
    }
  }

  return true;
}

function _useArrayPath(dataObject, path, useIndex) {
  logger.debug(path);
  let splits = path.split('.');
  logger.debug(splits);

  if (path !== '') {
    for (let i = 0; i < splits.length; i++) {
      logger.debug(splits[i]);
      if (!isNaN(splits[i])) {
        let path = splits.slice(0, i).join('.');
        logger.debug(path);
        //check if path refers to array
        if (Object.prototype.toString.call(jsonpath.query(dataObject, path)) === '[object Array]') {
          if (useIndex) {
            splits[i - 1] += '[' + splits[i] + ']';
          } else {
            splits[i - 1] += '[*]';
          }

          splits.splice(i, 1);
          i--;
        }
      }
    }

    path = splits.join('.');
  }

  return path;
}

function searchValue(dataObject, value, path) {
  let keys = Object.keys(dataObject);
  let i = 0;
  let result = null;

  function checkValue(i) {
    let currentObject = dataObject[keys[i]];
    let currentPath = path === '' ? keys[i] : path + '.' + keys[i];
    let result = null;

    if (currentObject !== null) {
      if (typeof currentObject === 'object') {
        result = searchValue(currentObject, value, currentPath);
      } else {
        //console.log(value + ' ' + currentObject);
        if ('' + currentObject === value) {
          result = currentPath;
          //console.log(`result = ${result}`);
        } else {
          //console.log('no match');
        }
      }
    }

    return result;
  }

  while (i < keys.length && result === null) {
    result = checkValue(i);
    i++;
  }

  return result;
}

function _searchPaths(dataObject, values) {
  let valuesAndPaths = [];

  values.forEach(function (value) {
    let path = searchValue(dataObject, value, '$');

    if (path === null) {
      logger.debug('No path found for value \'' + value + '\'');
    } else {
      valuesAndPaths.push({path: path, value: value});
    }
  });

  return valuesAndPaths;
}

function searchPaths(dataObject, values) {
  let valuesAndPaths = _searchPaths(dataObject, values);

  valuesAndPaths.forEach(function (v) {
    v.path = _useArrayPath(dataObject, v.path, true);
  });

  return valuesAndPaths;
}

module.exports = {
  iteratorAndPaths: search,
  paths: searchPaths
};