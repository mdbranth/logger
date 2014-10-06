var assert = require('assert')
var log = require('../logger')

var calledOptions = [];

function mockJQuery () {
  return mockJQuery;
}

mockJQuery.ajax = ajax;
mockJQuery.reset = resetMockJQuery;

function ajax(options) {
  calledOptions.push(options);
}

function resetMockJQuery() {
  calledOptions = [];
}

describe('Logger', function(){
  describe('Basic Log', function(){
    var apiPath = 'https://localhost/test/api/log';
    log.init(mockJQuery).ttl('50').apiPath(apiPath);

    var log1 = {
      value: 'test'
    };
    var log2 = {
      test: 'test1'
    };

    it('should call log api once', function(done) {
      log(log1).log(log2);

      setTimeout(function() {
        assert.equal(1, calledOptions.length);
        var options = calledOptions[0];
        assert.equal(apiPath, options.url);
        var data = JSON.parse(options.data);
        var logs = data.logs;
        assert.equal(2, logs.length);
        assert.equal(JSON.stringify(log1), logs[0].json);
        assert.equal(JSON.stringify(log2), logs[1].json);
        done();
      }, 100);
    });

    it('should not call api if getAndClearQueue', function(done) {
      mockJQuery().reset();
      log(log1).log(log2);
      var queue = log.getAndClearQueue();
      assert.equal(2, queue.length);
      setTimeout(function() {
        assert.equal(0, calledOptions.length);
        done();
      }, 100);
    });
  })
});