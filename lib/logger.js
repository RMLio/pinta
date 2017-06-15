
const winston = require('winston');
//default log level
winston.level = 'error';

module.exports = {
  logger: winston,
  setLogLevel: function(level) {
    winston.level = level;
  }
};