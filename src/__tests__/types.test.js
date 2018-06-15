const types = require('../types');
const { ReadState, WriteState } = require('../state');

function makeWrite(type, value) {
  const state = new WriteState();
  type.ser(state, value);
  var buf = state.toBuf();
  var view = new Uint8Array(buf);
  
  var readState = new ReadState(buf);
  const reverse = type.deser(readState);
  
  return { view, array: Array.from(view), reverse }
}

it(`u8`, () => {
  expect(makeWrite(types.u8, 7).array).toEqual([7]);
  expect(makeWrite(types.u8, 7).reverse).toBe(7);
});

it(`u16`, () => {
  expect(makeWrite(types.u16, 31946).array).toHaveLength(2);
  expect(makeWrite(types.u16, 31946).reverse).toBe(31946);
});

it(`u32`, () => {
  const aboutAMillion = 1100321;
  expect(makeWrite(types.u32, aboutAMillion).array).toHaveLength(4);
  expect(makeWrite(types.u32, aboutAMillion).reverse).toBe(aboutAMillion);
});

it(`f32`, () => {
  const num = 40000.5;
  expect(makeWrite(types.f32, num).array).toHaveLength(4);
  expect(makeWrite(types.f32, num).reverse).toBe(num);
});

it(`str ascii`, () => {
  const str = `foo`;
  expect(makeWrite(types.str, str).array).toHaveLength(2 + 3);
  expect(makeWrite(types.str, str).reverse).toBe(str);
});

it(`str unicide`, () => {
  const str = `foo π 🤠`;
  expect(makeWrite(types.str, str).reverse).toBe(str);
});
