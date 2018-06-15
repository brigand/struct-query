const { buildSchema } = require('../schema');

describe(`create schema`, () => {
  it(`works`, () => {
    buildSchema([
      ['foo', 'u32'],
      ['bar', 'str'],
    ])
  });

  it(`errors on invalid type`, () => {
    var params = [
      ['foo', 'u32'],
      ['bar', 'not-a-valid-type'],
    ];

    expect(() => buildSchema(params)).toThrow(/to be one of/);
  });
});

describe(`dataToBuf`, () => {
  it(`works`, () => {
    var types = [
      ['foo', 'u32']
    ];
    var schema = buildSchema(types);
    var buf = schema.dataToBuf({ foo: 123 });
    expect(buf.byteLength).toBe(6);
  });
});

describe(`bufToData`, () => {
  it(`works`, () => {
    var types = [
      ['foo', 'u32'],
      ['bar', 'u16'],
    ];
    var schema = buildSchema(types);
    var buf = schema.dataToBuf({ foo: 123, bar: 456 });
    var data2 = schema.bufToData(buf);
    expect(data2).toEqual({ foo: 123, bar: 456 })
  });
});

describe(`dataToStr`, () => {
  it(`works`, () => {
    var types = [
      ['foo', 'u32'],
      ['bar', 'u16'],
    ];
    var schema = buildSchema(types);
    var str = schema.dataToStr({ foo: 123, bar: 456 });

    var bytes = 2 + 32 + 2 + 16;

    expect(str.length).toBeGreaterThanOrEqual(Math.floor(bytes / 4))
    expect(str.length).toBeLessThanOrEqual(Math.ceil(bytes / 2))
  });
});


describe(`strToData`, () => {
  it(`works`, () => {
    var types = [
      ['foo', 'u32'],
      ['bar', 'u16'],
    ];
    var schema = buildSchema(types);
    var value = { foo: 123, bar: 456 };
    var str = schema.dataToStr(value);
    var reversed = schema.strToData(str);
    expect(reversed).toEqual(value)
    
  });
});

