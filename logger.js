module.exports = log;

log.log = log;
log.error = error;
log.warn = warn;
log.init = init;
log.ttl = ttl;
log.apiPath = apiPath;
log.onError = onError;
log.getAndClearQueue = getAndClearQueue;

var $ = typeof window !== 'undefined' && window.$ || {};
function init(new$) {
  $ = new$;
  return log;
}

var _ttl = 2000;
function ttl(newTtl) {
  _ttl = newTtl;
  return log;
}

var _apiPath = '/api/log';
function apiPath(newApiPath) {
  _apiPath = newApiPath;
  return log;
}

var _onErr = function() {};
function onError(onErr) {
  _onErr = onErr;
  return log;
}

function warn(object) {
  return _log(object, 'warn');
}

function error(object) {
  return _log(object, 'error');
}

function log(object) {
  return _log(object, 'log');
}

function getAndClearQueue() {
  if (timeout) clearTimeout(timeout);
  var result = queue;
  queue = [];
  return result;
}

var queue = [];
var timeout;
function _log(object, logType) {
  var queueObject = {
    date: Date.now()
  };
  queueObject[logType] = JSON.parse(JSON.stringify(object));

  queue.push(queueObject);

  if (queue.length == 1) {
    timeout = setTimeout(flushQueue, _ttl);
  }

  return log;
}

var needsFlush = false;
var pendingRequest = null;
function flushQueue() {
  if (!queue.length) return;
  var options = {
    url: _apiPath,
    dataType: 'json',
    error: onError,
    success: onSuccess,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
        date: Date.now(),
        logs: queue
      })
  };
  if (pendingRequest) {
    needsFlush = true;
    return;
  }
  needsFlush = false;
  queue = [];
  pendingRequest = $.ajax(options);

  function onSuccess() {
    pendingRequest = null;
    if (needsFlush) flushQueue();
  }

  function onError() {
    if (_onErr) return _onErr();
  }
}

