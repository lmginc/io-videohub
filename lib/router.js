'use strict';

var net = require('net');
var trying = false;

var _ = require('underscore');
var events = require('events');
var router = require('./router');
var parser = require('./parser');
var lexer = require('./lexer');

var emitter = new events.EventEmitter();

exports.on = emitter.on;
exports.emit = emitter.emit;

exports.connection = null;
exports.statusObj = {};

/**
 *  Expose a connect method
 *
 *  @param {String} host
 *  @param {String} port
 *  @returns {Object}
 */

exports.connect = function(host, port) {
  if (exports.connected) return exports.connection;

  // TODO: refactor to not have this state
  if (trying) return;

  trying = true;

  exports.connection = net.createConnection(port, host);

  console.log('Trying to connect to %s:%s', host, port);

  exports.connection.on('data', function(data){
    router.updateStatus(parser(data.toString()));
  });

  exports.connection.on('connect', function(){
    exports.connected = true; 
    console.log('connected to %s:%s', host, port);
  });

  exports.connection.on('timeout', function(){
    throw new Error('Timeout connecting to router');
  });

  exports.connection.on('error', function(){
    throw new Error('Error in connection');
  });

  return exports.connection;
};

/**
 *  Update the status of the router
 *
 *  @param {Object} obj
 */

exports.updateStatus = function(obj){
  if (!obj) return;

  if (!exports.statusObj[obj.title]) {
    if (obj.array) {
      exports.statusObj[obj.title] = [];
    } else {
      exports.statusObj[obj.title] = {};
    };
  };
  
  for (var key in obj.data) {
    if (obj.array) {
      exports.statusObj[obj.title][parseInt(key, 10)] = obj.data[key];
    } else {
      exports.statusObj[obj.title][key] = obj.data[key];
    };
  };

  exports.emit('update', _.clone(exports.statusObj));
};

/**
 *  Route an output
 *
 *  @param {Number} output
 *  @param {Number} input
 */

exports.route = function(output, input) {
  var str = ['VIDEO OUTPUT ROUTING:', output+' '+input].join('\n');
  str += '\n\n';

  console.log(str);
  exports.connection.write(str);
};
