'use strict';

var EventEmitter = require('events').EventEmitter;

var Adaptor = source("adaptor"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Adaptor", function() {
  var connection = new EventEmitter;
  var adaptor = new Adaptor({ name: 'adaptor', connection: connection });

  describe("#constructor", function() {
    it("sets @self as a reference to the adaptor", function() {
      expect(adaptor.self).to.be.eql(adaptor);
    });

    it("sets @name to the provided name", function() {
      expect(adaptor.name).to.be.eql('adaptor');
    });

    it("sets @connection to the provided connection", function() {
      expect(adaptor.connection).to.be.eql(connection);
    });

    it("sets @commands to an empty array by default", function() {
      expect(adaptor.commands).to.be.eql([]);
    });
  });

  describe("#connect", function() {
    var callback = spy();

    before(function() {
      stub(Logger, 'info');
      adaptor.connect(callback);
    });

    after(function() {
      Logger.info.restore();
    });

    it("logs that it's connecting to the adaptor", function() {
      var string = "Connecting to adaptor 'adaptor'.";
      expect(Logger.info).to.be.calledWith(string);
    });

    it("triggers the provided callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#disconnect", function() {
    before(function() {
      stub(Logger, 'info');
      adaptor.disconnect();
    });

    after(function() {
      Logger.info.restore();
    });

    it("logs that it's disconnecting to the adaptor", function() {
      var string = "Disconnecting from adaptor 'adaptor'.";
      expect(Logger.info).to.be.calledWith(string);
    });
  });
});
