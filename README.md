# cellocator-parser

[![npm version](https://img.shields.io/npm/v/cellocator-parser.svg?style=flat-square)](https://www.npmjs.com/package/cellocator-parser)
[![npm downloads](https://img.shields.io/npm/dm/cellocator-parser.svg?style=flat-square)](https://www.npmjs.com/package/cellocator-parser)
[![Build Status](https://img.shields.io/travis/lgaticaq/cellocator-parser.svg?style=flat-square)](https://travis-ci.org/lgaticaq/cellocator-parser)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/cellocator-parser/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/cellocator-parser?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/cellocator-parser.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/cellocator-parser)
[![dependency Status](https://img.shields.io/david/lgaticaq/cellocator-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/cellocator-parser#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/cellocator-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/cellocator-parser#info=devDependencies)

> Parse raw data from cellocator devices

## Installation

```bash
npm i -S cellocator-parser
```

## Use

[Try on Tonic](https://tonicdev.com/npm/cellocator-parser)
```js
const cellocator = require('cellocator-parser');

const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1', 'hex');
cellocator.parse(raw).then(result => console.log(result));
/*{
  raw: '4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1',
  unitId: 776893,
  imei: 0,
  device: 'CelloTrack',
  type: 'data',
  loc: {
    type: 'Point',
    coordinates: [ -79.09097658351084, -7.953307941260071 ]
  },
  speed: 84.96,
  datetime: '2016-03-12T23:42:00.000Z',
  gpsTime: '2016-06-12T23:42:00.000Z',
  direction: 155.09967514191385,
  satellites: 9,
  voltage: {
    ada: 28.1176470588165,
    adb: 4.00235293989,
    adc: 45.41720000000001,
    add: 182
  },
  altitude: 223.23000000000002,
  status: {
    engine: false,
    unlockInactive: true,
    panicInactive: true,
    drivingStatus: true,
    shockInactive: true,
    doorInactive: true,
    ignitionPortStatus: true,
    accelerometerStatus: true,
    lock: true,
    noHibernation: false,
    momentarySpeed: false,
    privateMode: false,
    firmwareSubversion: '0011',
    canOriginatedOdometer: false,
    canOriginatedSpeed: false,
    dataType33_38: '0',
    messageSource: '0',
    garminConnected: false,
    garminEnable: false,
    messageInitiative: false,
    locationStatus: '00000000',
    charge: false,
    standardImmobilizer: false,
    globalOutput: false,
    ledOut: false,
    gpsPower: false,
    gradualStop: false,
    siren: false
  },
  version: 'HW: <223>, SW: <32>',
  transmissionReason: 32,
  odometer: 148770,
  gpsModes: {
    '1': {
      pMode: '>3 satellite solution',
      tpMode: 'Full power position',
      altMode: 'No altitude hold',
      dopMask: 'DOP mask not exceeded',
      dgps: 'No DGPS position'
    },
    '2': 'Validated'
  },
  plmn: 71610,
  sn: 13,
  messageType: 0
}*/
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
