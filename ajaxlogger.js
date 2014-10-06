var logger = require('./logger');

module.exports = logger;

logger.initajax = init;
var $ = null;
var _apiPath = '/api/log';
function init(new$, newApiPath) {
  $ = new$;
  logger.init(writeLog);
  if (newApiPath) _apiPath = newApiPath;
  return logger;
}

function writeLog(object, done) {
  var options = {
    url: _apiPath,
    dataType: 'json',
    error: onError,
    success: onSuccess,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(object)
  };

  $.ajax(options);

  function onError(err) {
    done(err);
  }

  function onSuccess() {
    done();
  }
}

