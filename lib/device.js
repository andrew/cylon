/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Logger = require('./logger'),
    Utils = require('./utils');

// Public: Creates a new Device
//
// opts - object containing Device params
//   name - string name of the device
//   pin - string pin of the device
//   robot - parent Robot to the device
//   connection - connection to the device
//   driver - string name of the module the device driver logic lives in
//
// Returns a new Device
var Device = module.exports = function Device(opts) {
  if (opts == null) {
    opts = {};
  }

  this.halt = Utils.bind(this.halt, this);
  this.start = Utils.bind(this.start, this);

  this.robot = opts.robot;
  this.name = opts.name;
  this.pin = opts.pin;
  this.connection = this.determineConnection(opts.connection) || this.defaultConnection();
  this.driver = this.initDriver(opts);

  Utils.proxyFunctionsToObject(this.driver.commands, this.driver, this);
};

Utils.subclass(Device, EventEmitter);

// Public: Starts the device driver
//
// callback - callback function to be executed by the driver start
//
// Returns result of supplied callback
Device.prototype.start = function(callback) {
  var msg = "Starting device '" + this.name + "'";

  if (this.pin != null) {
    msg += " on pin " + this.pin;
  }

  msg += ".";

  Logger.info(msg);
  return this.driver.start(callback);
};

// Public: Halt the device driver
//
// Returns result of supplied callback
Device.prototype.halt = function() {
  Logger.info("Halting device '" + this.name + "'.");
  return this.driver.halt();
};

// Public: Expresses the Device in JSON format
//
// Returns an Object containing Connection data
Device.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.driver.constructor.name || this.driver.name,
    pin: this.pin,
    connection: this.connection.toJSON(),
    commands: this.driver.commands
  };
};

// Public: Retrieves the connections from the parent Robot instances
//
// conn - name of the connection to fetch
//
// Returns a Connection instance
Device.prototype.determineConnection = function(conn) {
  return this.robot.connections[conn];
};

// Public: Returns a default Connection to use
//
// Returns a Connection instance
Device.prototype.defaultConnection = function() {
  var first = 0;

  for (var c in this.robot.connections) {
    var connection = this.robot.connections[c];
    first || (first = connection);
  }

  return first;
};

// Public: sets up driver with @robot
//
// opts - object containing options when initializing driver
//   driver - name of the driver to intt()
//
// Returns the set-up driver
Device.prototype.initDriver = function(opts) {
  if (opts == null) {
    opts = {};
  }

  Logger.debug("Loading driver '" + opts.driver + "'.");
  return this.robot.initDriver(opts.driver, this, opts);
};
