var stringUtils = require('./string');

var types = {
  u8: {
    ser: function (state, value) {
      state.addByte(value);
    },
    deser: function (state) {
      return state.takeByte();
    }
  },
  u16: {
    ser: function (state, value) {
      var low = value & 0xff;
      var high = (value & 0xff00) >> 8;
      state.addByte(low);
      state.addByte(high);
    },
    deser: function (state) {
      var low = state.takeByte();
      var high = state.takeByte();
      return (low) | (high << 8);
    }
  },
  u32: {
    ser: function (state, value) {
      var a = value & 0xff;
      var b = (value & 0xff00) >> 8;
      var c = (value & 0xff0000) >> 16;
      var d = (value & 0xff000000) >> 24;
      state.addByte(a);
      state.addByte(b);
      state.addByte(c);
      state.addByte(d);
    },
    deser: function (state) {
      var a = state.takeByte();
      var b = state.takeByte();
      var c = state.takeByte();
      var d = state.takeByte();
      return (a) | (b << 8) | (c << 16) | (d << 24);
    }
  },
  f32: {
    ser: function (state, value) {
      var buf = new ArrayBuffer(4);
      var viewf32 = new Float32Array(buf);
      var view8 = new Uint8Array(buf);
      viewf32[0] = value;
      
      state.addByte(view8[0]);
      state.addByte(view8[1]);
      state.addByte(view8[2]);
      state.addByte(view8[3]);
    },
    deser: function (state) {
      var a = state.takeByte();
      var b = state.takeByte();
      var c = state.takeByte();
      var d = state.takeByte();
      var buf = new ArrayBuffer(4);
      var viewf32 = new Float32Array(buf);
      var view8 = new Uint8Array(buf);
      view8[0] = a;
      view8[1] = b;
      view8[2] = c;
      view8[3] = d;
      return viewf32[0];
    }
  },
  str: {
    ser: function (state, value) {
      var view = stringUtils.strToBuf(value);
      types.u16.ser(state, view.length);
      for (var i = 0; i < view.length; i += 1) {
        types.u8.ser(state, view[i]);
      }
    },
    deser: function (state) {
      var len = types.u16.deser(state);
      var buf = new ArrayBuffer(len);
      for (let i = 0; i < len; i += 1) {
        buf[i] = state.takeByte();
      }
      return stringUtils.bufToStr(buf);
    }
  },
};

Object.keys(types).forEach(function (key) {
  types[key].name = key;
});

module.exports = types;
