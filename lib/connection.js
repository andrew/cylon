/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Logger = require('./logger'),
    Utils = require('./utils');

// The Connection class represents the interface to
// a specific group of hardware devices. Examples would be an
// Arduino, a Sphero, or an ARDrone.
var Connection;

// Public: Creates a new Connection
//
// opts - hash of acceptable params:
//   id - string ID for the connection
//   robot - Robot the Connection belongs to
//   name - name for the connection
//   adaptor - string module name of the adaptor to be set up
//   port - string port to use for the Connection
//
// Returns the newly set-up connection
module.exports = Connection = function Connection(opts) {
  if (opts == null) {
    opts = {};
  }

  if (opts.id == null) {
    opts.id = Math.floor(Math.random() * 10000);
  }

  this.connect = Utils.bind(this.connect, this);

  this.self = this;
  this.robot = opts.robot;
  this.name = opts.name;
  this.connection_id = opts.id;
  this.port = opts.port;
  this.adaptor = this.initAdaptor(opts);

  Utils.proxyFunctionsToObject(this.adaptor.commands, this.adaptor, this.self);
}

Utils.subclass(Connection, EventEmitter);

// Public: Expresses the Connection in JSON format
//
// Returns an Object containing Connection data
Connection.prototype.toJSON = function() {
  return {
    name: this.name,
    port: this.port,
    adaptor: this.adaptor.constructor.name || this.adaptor.name,
    connection_id: this.connection_id
  };
};

// Public: Connect the adaptor's connection
//
// callback - callback function to run when the adaptor is connected
//
// Returns the result of the supplied callback function
Connection.prototype.connect = function(callback) {
  var msg = "Connecting to " + this.name;
  var msg = "Connecting to '" + this.name + "'";

  if (this.port != null) {
    msg += " on port " + this.port;
  }

  msg += ".";

  Logger.info(msg);
  return this.adaptor.connect(callback);
};

// Public: Disconnect the adaptor's connection
//
// Returns nothing
Connection.prototype.disconnect = function() {
  var msg = "Disconnecting from '" + this.name + "'";

  if (this.port != null) {
    msg += " on port " + this.port;
  }

  msg += ".";

  Logger.info(msg);
  return this.adaptor.disconnect();
};

// Public: sets up adaptor with @robot
//
// opts - options for adaptor being initialized
//   adaptor - name of the adaptor
//
// Returns the set-up adaptor
Connection.prototype.initAdaptor = function(opts) {
  Logger.debug("Loading adaptor '" + opts.adaptor + "'.");
  return this.robot.initAdaptor(opts.adaptor, this.self, opts);
};

// Public: Halt the adaptor's connection
//
// Returns nothing
Connection.prototype.halt = function() {
  var msg = "Halting adaptor " + this.name;

  if (this.port != null) {
    msg += " on port " + this.port;
  }

  Logger.info(msg);
  return this.disconnect();
};
