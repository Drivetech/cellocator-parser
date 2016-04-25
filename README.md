# cellocator-parser

[![npm version](https://img.shields.io/npm/v/cellocator-parser.svg?style=flat-square)](https://www.npmjs.com/package/cellocator-parser)
[![npm downloads](https://img.shields.io/npm/dm/cellocator-parser.svg?style=flat-square)](https://www.npmjs.com/package/cellocator-parser)
[![Build Status](https://img.shields.io/travis/lgaticaq/cellocator-parser.svg?style=flat-square)](https://travis-ci.org/lgaticaq/cellocator-parser)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/cellocator-parser/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/cellocator-parser?branch=master)
[![dependency Status](https://img.shields.io/david/lgaticaq/cellocator-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/cellocator-parser#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/cellocator-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/cellocator-parser#info=devDependencies)
[![Join the chat at https://gitter.im/lgaticaq/cellocator-parser](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/lgaticaq/cellocator-parser?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Parse raw data from cellocator devices

## Installation

```bash
npm i -S cellocator-parser
```

## Use

```js
import cellocator from 'cellocator-parser'

const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1');
const data = cellocator.parse(raw);
```
