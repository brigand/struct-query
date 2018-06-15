
function ReadState(buf) {
  this.offset = 0;
  this._view = new Uint8Array(buf);
  this.buf = buf;
}

ReadState.prototype.takeByte = function() {
  if (this.offset >= this.buf.length) {
    throw new Error('Tried to read past end of buffer');
  }
  var value = this._view[this.offset];
  this.offset += 1;
  return value;
}


function WriteState() {
  this.offset = 0;
  this.data = [];
}

WriteState.prototype.addByte = function(byte) {
  this.data[this.offset] = byte & 0xff;
  this.offset += 1;
  return this;
}

WriteState.prototype.toBuf = function() {
  const arr = Uint8Array.from(this.data);
  return arr.buffer;
}

exports.ReadState = ReadState;
exports.WriteState = WriteState;
