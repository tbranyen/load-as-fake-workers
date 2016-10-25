Load as Fake Workers
====================

Loads scripts as fake Web Workers suitable for testing environments. Works
great with [worker-loader](https://github.com/webpack/worker-loader).

``` sh
npm install load-as-fake-workers
```

Use:

``` js
// Before your tests run...
require('load-as-fake-workers').register('client/workers/**/*.js');
```

Use with Babel:

``` js
const { transformFileSync } = require('babel-core');

// Before your tests run...
require('load-as-fake-workers').register('client/workers/**/*.js', src => {
  return transformFileSync(src).code;
});
```
