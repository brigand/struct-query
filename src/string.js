function strToBuf(str) {
  var utf8 = unescape(encodeURIComponent(str));
  var view = new Uint8Array(utf8.length);
  for (var i = 0; i < utf8.length; i++) {
      view[i] = utf8.charCodeAt(i);
  }
  return view;
}

function bufToStr(buf) {
  if (buf instanceof ArrayBuffer) {
    buf = new Uint8Array(buf);
  }
  return decodeURIComponent(escape(String.fromCharCode.apply(null, buf)));
}

exports.strToBuf = strToBuf;
exports.bufToStr = bufToStr;
