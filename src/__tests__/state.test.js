const { ReadState, WriteState } = require('../state');

describe(`ReadState`, () => {
  it(`works`, () => {
    const buf = new Buffer(5);
    const arr = new Uint8Array(buf);
    buf[1] = 7;
    buf[3] = 13;

    const read = new ReadState(buf);

    expect([
      read.takeByte(),
      read.takeByte(),
      read.takeByte(),
      read.takeByte(),
      read.takeByte(),
    ]).toEqual([
      0,
      7,
      0,
      13,
      0,
    ]);

    expect(() => read.takeByte()).toThrow(/end of buffer/);
  });
});

describe(`WriteState`, () => {
  it(`works`, () => {
    const write = new WriteState();

    write.addByte(0)
    write.addByte(12)
    write.addByte(17);

    const buf = write.toBuf();
    const view = new Uint8Array(buf);
    expect(view.length).toBe(3);
    expect(view[0]).toBe(0);
    expect(view[1]).toBe(12);
    expect(view[2]).toBe(17);
  });
});

