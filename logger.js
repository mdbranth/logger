module.exports = log;

log.log = log;
log.error = error;
log.warn = warn;
log.init = init;
log.ttl = ttl;
log.onError = onError;
log.getAndClearQueue = getAndClearQueue;

var _writeLogFunction = function(done) {};
function init(writeLogFunction) {
  _writeLogFunction = writeLogFunction;
  return log;
}

var _ttl = 2000;
function ttl(newTtl) {
  _ttl = newTtl;
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
var pendingRequest = false;
function flushQueue() {
  if (!queue.length) return;

  if (pendingRequest) {
    needsFlush = true;
    return;
  }
  
  var object = {
    date: Date.now(),
    logs: queue
  };

  needsFlush = false;
  queue = [];

  _writeLogFunction(object, onDone);
  pendingRequest = true;

  function onDone(err) {
    pendingRequest = false;
    if (err) return _onErr && _onErr();
    if (needsFlush) flushQueue();
  }
}

