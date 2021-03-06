'use strict';

var EventEmitter = require('events').EventEmitter;

var Driver = source("driver"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Driver", function() {
  var device = {
    connection: {},
    emit: spy()
  };

  var driver = new Driver({
    name: 'driver',
    device: device
  });

  describe("#constructor", function() {
    it("sets @self as a reference to the driver", function() {
      expect(driver.self).to.be.eql(driver);
    });

    it("sets @name to the provided name", function() {
      expect(driver.name).to.be.eql('driver');
    });

    it("sets @device to the provided device", function() {
      expect(driver.device).to.be.eql(device);
    });

    it("sets @connection to the provided device's connection", function() {
      expect(driver.connection).to.be.eql(device.connection);
    });

    it("sets @commands to an empty array by default", function() {
      expect(driver.commands).to.be.eql([]);
    });
  });

  describe("#start", function() {
    var callback = spy();

    before(function() {
      stub(Logger, 'info');
      driver.start(callback);
    });

    after(function() {
      Logger.info.restore();
    });

    it("logs that it's starting the driver", function() {
      var string = "Driver driver started.";
      expect(Logger.info).to.be.calledWith(string);
    });

    it("triggers the provided callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#halt", function() {
    before(function() {
      stub(Logger, 'info');
      driver.halt();
    });

    after(function() {
      Logger.info.restore();
    });

    it("logs that it's halting the driver", function() {
      expect(Logger.info).to.be.calledWith("Driver driver halted.")
    });
  });
});
