module.exports = log;

log.log = log;
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

var queue = [];
var timeout;
function log(object) {
  var queueObject = {
    json: JSON.stringify(object),
    date: new Date()
  };

  queue.push(queueObject);

  if (queue.length == 1) {
    timeout = setTimeout(flushQueue, _ttl);
  }

  return log;
}

function getAndClearQueue() {
  if (timeout) clearTimeout(timeout);
  var result = queue;
  queue = [];
  return result;
}

function flushQueue() {
  if (!queue.length) return;
  var options = {
    url: _apiPath,
    dataType: 'json',
    error: _onErr || function() {},
    success: onSuccess,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
        date: new Date(),
        logs: queue
      })
  };
  queue = [];
  $.ajax(options);

  function onSuccess() {
  }
}

