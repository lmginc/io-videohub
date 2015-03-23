'use strict';

if (!process.env.INTEGRATION) return;

var assert = require('assert');
var router = require(__dirname+'/../../lib/router');
var parser = require(__dirname+'/../../lib/parser');

var ip = process.env.ROUTER_IP;
var ios = process.env.IO_NUMBERS;

ios = parseInt(ios, 10);

describe('parser()', function(){
  this.timeout(3000);
  it('parses the dump', function(d){

    var conn = router.connect('127.0.0.1', '9991');

    conn.on('connect', function(){
      setTimeout(function(){

        var obj = router.statusObj;

        assert(obj);
        assert(obj.protocol_preamble);
        assert(typeof obj.protocol_preamble === 'object');
        assert(obj.videohub_device);
        assert(typeof obj.videohub_device === 'object');
        assert(obj.input_labels.length === ios);
        assert(obj.output_labels.length === ios);
        assert(obj.video_output_routing.length === ios);
        assert(obj.video_output_locks.length === ios);

        d();
      
      }, 3000);
    });
  });
});
