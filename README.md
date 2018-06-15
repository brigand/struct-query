Tiny encoding of simple data. Mainly intended for encoding form state,
such as search params. The default encoding use base58 encoding, which
looks nice in URLs.

Install:


```
npm install --save struct-query
```

Usage:

```
const { buildSchema } = require('./');
const schema = buildSchema([
  ['page', 'u16'],
  ['search', 'str'],
]);

const encoded = schema.dataToStr({
  page: 3,
  search: 'foo',
})

console.log(encoded); // => kKdEcB56NNr

const decoded = schema.strToData(encoded);

console.log(decoded); // => { page: 3, search: 'foo' }
```

Current types supported:

 - u8
 - u16
 - u32
 - f32
 - str

