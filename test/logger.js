var assert = require('assert')
var log = require('../ajaxlogger')

var logCalls = [];

function writeLog(text, done) {
  logCalls.push(text);
  return done();
}

function resetLogs() {
  logCalls = [];
}

describe('Basic Logger', function(){
  describe('Basic Log', function(){
    var apiPath = 'https://localhost/test/api/log';
    log.init(writeLog).ttl('50');

    var log1 = {
      value: 'test'
    };
    var log2 = {
      test: 'test1'
    };
    var error1 = {
      value: 'error1'
    };
    var warn1 = {
      value: 'warn1'
    };

    it('should call log api once', function(done) {
      log(log1).log(log2).error(error1).warn(warn1);

      setTimeout(function() {
        assert.equal(1, logCalls.length);
        var data = logCalls[0];
        var logs = data.logs;
        assert.equal(4, logs.length);
        assert.equal(JSON.stringify(log1), JSON.stringify(logs[0].log));
        assert.equal(JSON.stringify(log2), JSON.stringify(logs[1].log));
        assert.equal(JSON.stringify(error1), JSON.stringify(logs[2].error));
        assert.equal(JSON.stringify(warn1), JSON.stringify(logs[3].warn));
        done();
      }, 100);
    });

    it('should be able to log a second time', function(done) {
      resetLogs();
      log(log1);
      setTimeout(function() {
        assert.equal(1, logCalls.length);
        done();
      }, 100);
    }); 

    it('should not call api if getAndClearQueue', function(done) {
      resetLogs();
      log(log1).log(log2);
      var queue = log.getAndClearQueue();
      assert.equal(2, queue.length);
      setTimeout(function() {
        assert.equal(0, logCalls.length);
        done();
      }, 100);
    });

    it('should be able to force queue flush', function(done) {
      resetLogs();
      log(log1).log(log2).flush();
      assert.equal(1, logCalls.length);
      resetLogs();
      setTimeout(function() {
        assert.equal(0, logCalls.length);
        done();
      }, 100);
    });
  })
});