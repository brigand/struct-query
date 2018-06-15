var types = require('./types');
var state = require('./state');
var has = Object.prototype.hasOwnProperty;
var bs58 = require('bs58');

var ReadState = state.ReadState;
var WriteState = state.WriteState;

function buildSchema(items) {
  if (!Array.isArray(items)) throw new Error('Invalid schema. Must be an array');

  var results = [];
  var nameToResult = Object.create(null);
  var idToResult = Object.create(null);

  items.forEach(function (item, index) {
    var name = item[0];
    var type = item[1];

    if (!has.call(types, type)) {
      var loc = 'items[' + index + '][1]';
      throw new Error('Expected ' + loc + ' to be one of ' + Object.keys(types) + ' but got ' + type);
    }

    var id = index + 1;
    var result = { name: name, id: id, type: types[type] };
    results.push(result);
    nameToResult[name] = result;
    idToResult[id] = result;
  });

  function dataToBuf(data) {
    var state = new WriteState();
    results.forEach(function (result) {
      if (!has.call(data, result.name) || data[result.name] == null) return;

      var value = data[result.name];
     
      types.u16.ser(state, result.id);
      result.type.ser(state, value);
    });

    return state.toBuf();
  }

  function bufToData(buf) {
    if (buf.buffer) {
      buf = buf.buffer;
    }
    var state = new ReadState(buf);
    var data = {};

    let remainingIterations = 10000;
    while (!state.isAtEnd() && remainingIterations > 0) {
      remainingIterations -= 1;
      var id = types.u16.deser(state);
      var result = has.call(idToResult, String(id)) && idToResult[id];


      if (!result) {
        throw new Error('Unknown type with id/index ' + id);
      }
     
      data[result.name] = result.type.deser(state);
    }

    if (remainingIterations <= 0) {
      
      throw new Error('Extraction loop didn\'t end after 10,000 iterations');
    }

    return data;
  }

  function dataToStr(data) {
    var buf = dataToBuf(data);
    var view = new Uint8Array(buf);
    return bs58.encode(view);
  }

  function strToData(str) {
    var nodeBuf = bs58.decode(str);
    var buf = Uint8Array.from(nodeBuf).buffer;
    return bufToData(buf);
  }

  return {
    dataToBuf: dataToBuf,
    bufToData: bufToData,
    dataToStr: dataToStr,
    strToData: strToData,
  };  
}

exports.buildSchema = buildSchema;
