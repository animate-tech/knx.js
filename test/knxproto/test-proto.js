'use strict';
const knxnetprotocol = require('../../src/KnxProtocol.js');
const assert = require('assert');
const test = require('tape');

test('KNX protocol encoder', function(t) {
  var dgrams = [
    "06100205001a0801c0a80ab3d96d0801c0a80ab3d83604040200", //CONNECT_REQUEST
    "061002060014030008010a0c17350e5704040000",             // CONNECT_RESPONSE
    "0610020600080024", // CONNECT_RESPONSE, failure E_NO_MORE_CONNECTIONS: 0x24
    "061004200015040200002e00bce000000832010081",  // tunneling request  apdu=1byte
    "061004200016040201002900bce00000083b0200804a" // tunneling request apdu=2byte
  ];

  knxnetprotocol.debug = true;

  for (var i=0; i < dgrams.length; i++) {
    var buf = new Buffer(dgrams[i], 'hex');
  	var reader = knxnetprotocol.createReader(buf);
    var writer = knxnetprotocol.createWriter();
  	reader.KNXNetHeader('packet'+i);
    var decoded = reader.next()['packet'+i];
    console.log("\n=== %j (%d bytes) ===> %j",
      dgrams[i], buf.length, decoded);
    writer.KNXNetHeader(decoded);
    if (Buffer.compare(buf, writer.buffer) != 0) {
      console.log("\n\n========\n  OOPS\n========\nbuffer[%d] is different: %j", i, decoded);
      console.log(buf);
      console.log(writer.buffer);
    }
    t.ok(Buffer.compare(buf, writer.buffer) == 0);
  }
  t.end();
});