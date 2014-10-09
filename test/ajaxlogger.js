var assert = require('assert');
var log = require('../ajaxlogger');

var ajaxCalls = [];

function myAjax(options) {
  if (_ajaxSend) {
    _ajaxSend(null, null, options);
  }
  ajaxCalls.push(options);
}

function resetAjax() {
  ajaxCalls = [];
}

var _ajaxSend;
function ajaxSend(val) {
  _ajaxSend = val;
}

var $ = {ajax: myAjax, ajaxSend: ajaxSend};

describe('Ajax Logger', function() {
  describe('Basic Log', function() {
    log.initajax($, '/test');
    var log1 = {
      value: 'test'
    };

    it('should flush logs when making additional api call', function(done) {
      log(log1);
      $.ajax({url: '/somethingelse', data: JSON.stringify({text: 'test'})});
      assert.equal(1, ajaxCalls.length);
      var data = JSON.parse(ajaxCalls[0].data);
      assert.equal('test', data.text);
      assert.equal(1, data.log.logs.length);
      resetAjax();
      setTimeout(function() {
        assert.equal(0, ajaxCalls.length);
        done();
      }, 100);
    });
  })
});