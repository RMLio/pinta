/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const jsonpath = require('jsonpath');
const logger = require('./logger.js').logger;

/**
 * This functions returns the iterator and paths for all values.
 * @param dataObject: the object in which to look for the values
 * @param values: the values which to look for
 * @returns {{iterator: string, paths: *}}: the iterator and the paths to the values in the object
 */
function search(dataObject, values) {
  let iterator = '';

  let valuesAndPaths = _searchPaths(dataObject, values);

  //get all the paths, not the values
  let paths = valuesAndPaths.map(function (value) {
    return value.path;
  });

  //check if at least one path is found
  if (paths.length > 0) {

    //if there is more than one path we create the iterator differently
    if (paths.length > 1) {
      let currentPath = paths[0];
      let i = 0;

      //we find out up until which character the paths are the same
      while (i < currentPath.length && _isFirstLetter(paths, currentPath[i])) {
        iterator += currentPath[i];
        _removeFirstLetter(paths);
        i++;
      }

      //we found the iterator, now we remove iterator from path
      valuesAndPaths.forEach(function (v) {
        v.path = v.path.substr(iterator.length);
        v.path = _useArrayPath(dataObject, v.path);
      });
    } else {
      //we will consider everything up until the last element the iterator
      //we search for the last element
      let last = valuesAndPaths[0].path.lastIndexOf('.');

      //we get the iterator when there is at a least a last element and at least two elements
      if (last !== -1) {
        iterator = valuesAndPaths[0].path.substr(0, last);
        valuesAndPaths[0].path = valuesAndPaths[0].path.substr(last + 1);
      }
    }

    //if the iterator end at a dot, we remove that dot
    if (iterator[iterator.length - 1] === '.') {
      iterator = iterator.substr(0, iterator.length - 1);
    }

    //we update array references in the iterator
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

/**
 * This function removes the first letter of a string.
 * @param str: the string from which the first letter needs to be removed
 * @private
 */
function _removeFirstLetter(str) {
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].substr(1);
  }
}

/**
 * This function returns true if @letter is the first letter of all strings in @strings.
 * @param strings: an array of strings in which to look for the first letter
 * @param letter: the first letter for which to look
 * @returns {boolean}: true if every string has as first letter @letter, false otherwise
 * @private
 */
function _isFirstLetter(strings, letter) {
  for (let i = 0; i < strings.length; i++) {
    if (strings[i] === undefined || strings[i] === '' || strings[i][0] !== letter) {
      return false;
    }
  }

  return true;
}

/**
 * This function updates the path when it refers to arrays.
 * @param dataObject: the object on which to apply the path
 * @param path: the original path
 * @param useIndex: true if you want use the index ([index]) or false if you want to refer to all elements in an array ([*])
 * @returns {*}: the updated path
 * @private
 */
function _useArrayPath(dataObject, path, useIndex) {
  logger.debug(path);
  let splits = path.split('.');
  logger.debug(splits);

  //check if the path is not empty
  if (path !== '') {
    for (let i = 0; i < splits.length; i++) {
      logger.debug(splits[i]);
      //check if the element is a number
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

/**
 * This function search for the path of @value in @dataObject where the current path is already @path.
 * @param dataObject: the object in which to look for @value
 * @param value: the value to look for
 * @param path: the current path
 * @returns {*}: the final path
 * @private
 */
function _searchValue(dataObject, value, path) {
  let keys = Object.keys(dataObject);
  let i = 0;
  let result = null;

  function checkValue(i) {
    let currentObject = dataObject[keys[i]];
    let currentPath = path === '' ? keys[i] : path + '.' + keys[i];
    let result = null;

    if (currentObject !== null) {
      if (typeof currentObject === 'object') {
        result = _searchValue(currentObject, value, currentPath);
      } else {
        if ('' + currentObject === value) {
          result = currentPath;
        } else {
          logger.debug('no match');
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

/**
 * This function returns the paths for the values in the data object.
 * @param dataObject: the object in which to look for @values
 * @param values: the values for which to look
 * @returns {Array}: the paths of the values
 * @private
 */
function _searchPaths(dataObject, values) {
  let valuesAndPaths = [];

  //we search for the paths of all values
  values.forEach(function (value) {
    let path = _searchValue(dataObject, value, '$');

    //path is not found
    if (path === null) {
      logger.debug('No path found for value \'' + value + '\'');
    } else {
      //path is found
      valuesAndPaths.push({path: path, value: value});
    }
  });

  return valuesAndPaths;
}

/**
 * This function returns the paths of the values in the data object, while updating the array references in the paths.
 * @param dataObject: object in which to look for @values
 * @param values: the values for which to look
 * @returns {Array}: the paths of @values in @dataObject
 */
function searchPaths(dataObject, values) {
  let valuesAndPaths = _searchPaths(dataObject, values);

  //we update the references to arrays in the paths
  valuesAndPaths.forEach(function (v) {
    v.path = _useArrayPath(dataObject, v.path, true);
  });

  return valuesAndPaths;
}

function _searchValuesAndPaths(dataObject, currentPath, results) {
  let keys = Object.keys(dataObject);

  keys.forEach(key => {
    let currentObject = dataObject[key];
    let path = currentPath + '.' + key;

    if (typeof currentObject === 'object') {
      _searchValuesAndPaths(currentObject, path, results);
    } else {
      results.push({
        path: _useArrayPath(dataObject, path, true),
        value: currentObject
      })
    }
  });
}

function searchValuesAndPaths(dataObject) {
  let results = [];

  _searchValuesAndPaths(dataObject, '$', results);

  return results;
}

module.exports = {
  iteratorAndPaths: search,
  paths: searchPaths,
  searchValuesAndPaths: searchValuesAndPaths
};