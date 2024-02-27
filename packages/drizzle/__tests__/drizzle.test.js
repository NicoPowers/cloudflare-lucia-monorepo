'use strict';

const drizzle = require('..');
const assert = require('assert').strict;

assert.strictEqual(drizzle(), 'Hello from drizzle');
console.info('drizzle tests passed');
