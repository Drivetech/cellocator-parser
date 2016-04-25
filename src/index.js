'use strict';

import ConvertBase from 'convert-base';
import moment from 'moment';
import pad from 'pad';

const patterns = {
  data: /^([A-F0-9]{10})([A-F0-9]{8})([A-F0-9]{6})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{10})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{6})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{18})([A-F0-9]{4})([A-F0-9]{6})([A-F0-9]{2})([A-F0-9]{8})([A-F0-9]{8})([A-F0-9]{8})([A-F0-9]{8})([A-F0-9]{4})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{4})([A-F0-9]{2})$/i
};

const hardwares = [
  {
    id: 1,
    model: {id: 1, name: 'CR300'},
    modem: {code: 7, name: 'GE864-QUAD-V2'}
  }, {
    id: 2,
    model: {id: 2, name: 'CFE'},
    modem: {code: 0, name: 'No Modem'}
  }, {
    id: 194,
    model: {id: 2, name: 'PHSN RF Head'},
    modem: {code: 6, name: 'No Modem'}
  }, {
    id: 35,
    model: {id: 3, name: 'Olympic'},
    modem: {code: 1, name: 'No Modem - Tetra/Astro external modem'}
  }, {
    id: 4,
    model: {id: 4, name: 'Compact Fleet'},
    modem: {code: 0, name: 'Sony/Erickson GR47'}
  }, {
    id: 36,
    model: {id: 4, name: 'Compact Fleet'},
    modem: {code: 1, name: 'Enfora Enabler II-G'}
  }, {
    id: 68,
    model: {id: 4, name: 'Compact Fleet'},
    modem: {code: 2, name: 'Telit GE864, old retrofit board(obsolete)'}
  }, {
    id: 100,
    model: {id: 4, name: 'Compact Fleet'},
    modem: {code: 3, name: 'Telit GE864, mute support'}
  }, {
    id: 5,
    model: {id: 5, name: 'Compact Security'},
    modem: {code: 0, name: 'Sony/Erickson GR47'}
  }, {
    id: 37,
    model: {id: 5, name: 'Compact Security'},
    modem: {code: 1, name: 'Enfora Enabler II-G'}
  }, {
    id: 69,
    model: {id: 5, name: 'Compact Security'},
    modem: {code: 2, name: 'Telit GE864, old retrofit board(obsolete)'}
  }, {
    id: 101,
    model: {id: 5, name: 'Compact Security'},
    modem: {code: 3, name: 'Telit GE864, mute support'}
  }, {
    id: 39,
    model: {id: 7, name: 'Compact CAN 8 Sensor'},
    modem: {code: 1, name: 'Enfora Enabler II-G'}
  }, {
    id: 71,
    model: {id: 7, name: ''},
    modem: {code: 2, name: 'Telit GE864, old retrofit board(obsolete)'}
  }, {
    id: 199,
    model: {id: 7, name: 'Compact CAN TOB'},
    modem: {code: 6, name: 'Telit GE864, automotive'}
  }, {
    id: 8,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit JF2 GPS)'},
    modem: {code: 0, name: 'Cinterion BGS2-W.Rel2'}
  }, {
    id: 40,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit JF2 GPS)'},
    modem: {code: 1, name: 'Cinterion EHS5-E'}
  }, {
    id: 72,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit JF2 GPS)'},
    modem: {code: 2, name: 'Cinterion EHS5-US'}
  }, {
    id: 136,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit SE868-V2 GNSS)'},
    modem: {code: 4, name: 'Cinterion BGS2-W.Rel2'}
  }, {
    id: 168,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit SE868-V2 GNSS)'},
    modem: {code: 5, name: 'Cinterion EHS5-E'}
  }, {
    id: 200,
    model: {id: 8, name: 'CelloTrack nano 10 (Telit SE868-V2 GNSS)'},
    modem: {code: 6, name: 'Cinterion EHS5-US'}
  }, {
    id: 9,
    model: {id: 9, name: '370-50'},
    modem: {code: 0, name: 'Sony/Erickson GR47'}
  }, {
    id: 105,
    model: {id: 9, name: '370-50'},
    modem: {code: 3, name: 'Telit GE864, mute support'}
  }, {
    id: 170,
    model: {id: 10, name: 'CelloTrack 1 Output'},
    modem: {code: 5, name: 'Enfora 3'}
  }, {
    id: 235,
    model: {id: 11, name: 'CR300B'},
    modem: {code: 7, name: 'GE864-QUAD-V2'}
  }, {
    id: 172,
    model: {id: 12, name: 'CelloTrack'},
    modem: {code: 5, name: 'Enfora III'}
  }, {
    id: 78,
    model: {id: 14, name: 'Cello-IQ GNSS'},
    modem: {code: 2, name: 'GE910 QUAD V3'}
  }, {
    id: 209,
    model: {id: 17, name: 'Compact CAN TOB'},
    modem: {code: 6, name: 'Telit GE864, automotive'}
  }, {
    id: 18,
    model: {id: 18, name: 'CelloTrack T (2G)'},
    modem: {code: 0, name: 'Telit GE910 QUAD (v2) (V3)'}
  }, {
    id: 82,
    model: {id: 18, name: 'CelloTrack T (3G)'},
    modem: {code: 2, name: 'Telit HE910 NAD'}
  }, {
    id: 19,
    model: {id: 19, name: 'CelloTrackPower T (2G)'},
    modem: {code: 0, name: 'Telit GE910 QUAD (v2) (V3)'}
  }, {
    id: 83,
    model: {id: 19, name: 'CelloTrackPower T (3G)'},
    modem: {code: 2, name: 'Telit HE910 NAD'}
  }, {
    id: 20,
    model: {id: 20, name: 'Cello-CANiQ (NA)'},
    modem: {code: 0, name: 'UE910 NAR'}
  }, {
    id: 52,
    model: {id: 20, name: 'Cello-CANiQ (EU)'},
    modem: {code: 1, name: 'UE910 EUR'}
  }, {
    id: 84,
    model: {id: 20, name: 'Cello-CANiQ (2G)'},
    modem: {code: 2, name: 'GE910 QUAD V3'}
  }, {
    id: 182,
    model: {id: 22, name: 'compact EOB'},
    modem: {code: 5, name: 'Enfora III'}
  }, {
    id: 183,
    model: {id: 23, name: 'CelloTrack Power'},
    modem: {code: 5, name: 'Enfora III'}
  }, {
    id: 216,
    model: {id: 24, name: 'Cello (Telit)'},
    modem: {code: 6, name: 'Telit GE864, automotive'}
  }, {
    id: 249,
    model: {id: 25, name: 'Cello Cinterion'},
    modem: {code: 7, name: 'Cinterion BGS3'}
  }, {
    id: 26,
    model: {id: 26, name: 'Cello Cinterion'},
    modem: {code: 0, name: 'Cinterion BGS2-W.Rel2'}
  }, {
    id: 58,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit SE868-V2 GNSS)'},
    modem: {code: 1, name: 'Cinterion EHS5-E'}
  }, {
    id: 90,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit SE868-V2 GNSS)'},
    modem: {code: 2, name: 'Cinterion EHS5-US'}
  }, {
    id: 122,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit SE868-V2 GNSS)'},
    modem: {code: 3, name: 'Cinterion EHS6'}
  }, {
    id: 154,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit JF2 GPS)'},
    modem: {code: 4, name: 'Cinterion BGS2-W.Rel2'}
  }, {
    id: 186,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit JF2 GPS)'},
    modem: {code: 5, name: 'Cinterion EHS5-E'}
  }, {
    id: 218,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit JF2 GPS)'},
    modem: {code: 6, name: 'Cinterion EHS5-US'}
  }, {
    id: 250,
    model: {id: 26, name: 'CelloTrack nano 20 (Telit JF2 GPS)'},
    modem: {code: 7, name: 'Cinterion EHS6'}
  }, {
    id: 220,
    model: {id: 28, name: '(Compact (TOB)) in use'},
    modem: {code: 6, name: 'Telit GE864, automative'}
  }, {
    id: 221,
    model: {id: 29, name: 'CR200'},
    modem: {code: 6, name: 'Telit GE864, automative'}
  }, {
    id: 223,
    model: {id: 30, name: 'CR200B'},
    modem: {code: 6, name: 'Telit GE864, automative'}
  }, {
    id: 224,
    model: {id: 31, name: 'Cello-IQ'},
    modem: {code: 6, name: 'Telit GE864, automative'
  }}
];

const getData = (raw) => {
  const match = patterns.data.exec(raw);
  const datetime = parseDatetime(match[29], match[28], match[27], match[26], match[25], match[24]); // 124-126, 126-128, 128-130, 130-132, 132-134, 134-138
  const loc = getLoc(match[19], match[20]); // 88-96, 96-104
  const speed = parseSpeed(match[22]); // 112-120
  const gpsTime = parseGpsTime(match[16], match[24]); // 76-80, 124-126
  const direction = parseDirection(match[23]); // 120-124
  const satellites = parseSatellites(match[18]); // 86-88
  const analog1 = parseAnalogInput1(match[11]); // 50-52
  const analog2 = parseAnalogInput2(match[12]); // 52-54
  const analog3 = parseAnalogInput3(match[13]); // 54-56
  const analog4 = parseAnalogInput4(match[14]); // 56-58
  const altitude = parseAltitude(match[21]); // 104-112
  const engine = parseEngineStatus(match[7]); // 38-40
  const {
    unlockInactive, panicInactive, drivingStatus, shockInactive,
    doorInactive
  } = parseIO1(match[8]); // 40-42
  const {ignitionPortStatus, accelerometerStatus, lock} = parseIO2(match[9]); // 42-44
  const version = parseVersion(match[4], match[5]); // 24-26, 26-28
  const data = {
    raw: match[0],
    device: 'CelloTrack',
    type: 'data',
    loc: loc || null,
    speed: speed || null,
    datetime: datetime || null,
    gpsTime: gpsTime || null,
    direction: direction || null,
    satellites: satellites || null,
    voltage: {
      ada: analog1 || null,
      adb: analog2 || null,
      adc: analog3 || null,
      add: analog4 || null
    },
    altitude: altitude || null,
    status: {
      engine: engine === 1,
      unlockInactive: unlockInactive === 1,
      panicInactive: panicInactive === 1,
      drivingStatus: drivingStatus === 1,
      shockInactive: shockInactive === 1,
      doorInactive: doorInactive === 1,
      ignitionPortStatus: ignitionPortStatus === 1,
      accelerometerStatus: accelerometerStatus === 1,
      lock: lock === 1
    },
    version: version || null
  };
  return data;
};

const parse = (raw) => {
  let result = {type: 'UNKNOWN', raw: raw.toString()};
  if (patterns.data.test(raw)) {
    result = getData(raw);
  }
  return result;
};

const isCello = (raw) => {
  let result = false;
  if (patterns.data.test(raw)) {
    result = true;
  }
  return result;
};

const reverseHex = (data) => {
  data = data.toUpperCase();
  if (data.length % 2 !== 0) data = `0${data}`;
  return data.split(/([A-F0-9]{2})/).filter(x => x !== '').reverse().join('');
};

const convertBase = (data, fromBase , toBase) => {
  const converter = new ConvertBase();
  return converter.convert(data, fromBase, toBase);
};

const lpad = (data) => pad(2, data, '0');

const notBinaryData = (data) => {
  return data.split('').map(x => x === '1' ? '0' : '1').join('');
};

const parseDatetime = (year, month, day, hour, minute, second) => {
  year = convertBase(reverseHex(year), 16, 10);
  month = lpad(convertBase(month, 16, 10));
  day = lpad(convertBase(day, 16, 10));
  hour = lpad(convertBase(hour, 16, 10));
  minute = lpad(convertBase(minute, 16, 10));
  second = lpad(convertBase(second, 16, 10));
  const date = `${year}${month}${day}${hour}${minute}${second}`;
  return moment(`${date}+00:00`, 'YYYYMMDDHHmmssZZ').toISOString();
};

const parseLatitude = (data) => {
  let lat = 0;
  data = reverseHex(data);
  if (data[0] === 'F') {
    lat = convertBase(notBinaryData(convertBase(data, 16, 2)), 2, 10);
    lat = (lat + 1) * -1;
  } else {
    lat = convertBase(data, 16, 10);
  }
  return lat * (180 / Math.PI) * Math.pow(10, -8);
};

const parseLongitude = (data) => {
  let lng = 0;
  data = reverseHex(data);
  if (data[0] === 'F') {
    lng = convertBase(notBinaryData(convertBase(data, 16, 2)), 2, 10);
    lng = (lng + 1) * -1 * (180 / Math.PI) * Math.pow(10, -8);
  } else {
    lng = convertBase(data, 16, 10);
    lng = lng * (180 / Math.PI) * Math.pow(10, -9);
  }
  return lng ;
};

const getLoc = (lng, lat) => {
  return {
    type: 'Point',
    coordinates: [parseLongitude(lng), parseLatitude(lat)]
  };
};

const parseGpsTime = (data, seconds) => {
  seconds = lpad(convertBase(seconds, 16, 10));
  const now = moment().format('YYYY-MM');
  data = convertBase(reverseHex(data), 16, 2);
  const day = `00${convertBase(data.substr(0, 5), 2, 10)}`.substr(-2);
  const hours = `00${convertBase(data.substr(5, 5), 2, 10)}`.substr(-2);
  const minutes = `00${convertBase(data.substr(10, 6), 2, 10)}`.substr(-2);
  return moment(`${now}-${day} ${hours}:${minutes}:${seconds}`).toISOString();
};

const parseSpeed = (data) => convertBase(reverseHex(data), 16, 10) * 0.036;

const parseDirection = (data) => convertBase(reverseHex(data), 16, 10) * (180 / Math.PI) * 0.001;

const parseSatellites = (data) => convertBase(data, 16, 10);

const parseEngineStatus = (data) => convertBase(data, 16, 10);

const parseIO1 = (data) => {
  data = convertBase(data, 16, 2);
  return {
    unlockInactive: convertBase(data.substr(0, 1), 2, 10),
    panicInactive: convertBase(data.substr(1, 1), 2, 10),
    drivingStatus: convertBase(data.substr(2, 1), 2, 10),
    shockInactive: convertBase(data.substr(6, 1), 2, 10),
    doorInactive: convertBase(data.substr(-1), 2, 10)
  };
};

const parseIO2 = (data) => {
  data = convertBase(data, 16, 2);
  return {
    ignitionPortStatus: convertBase(data.substr(0, 1), 2, 10),
    accelerometerStatus: convertBase(data.substr(1, 1), 2, 10),
    lock: convertBase(data.substr(5, 1), 2, 10)
  };
};

const parseHardware = (data) => {
  data = convertBase(data, 16, 2);
  const modem  = convertBase(data.substr(0, 3), 2, 10);
  const model = convertBase(data.substr(3, 5), 2, 10);
  const hardware = hardwares.find(x => x.model.id === model && x.modem.code === modem);
  return hardware ? hardware.id : '';
};

const parseSoftware = (data) => convertBase(data, 16, 10);

const parseVersion = (hw, sw) => `HW: <${parseHardware(hw)}>, SW: <${parseSoftware(sw)}>`;

const parseAnalogInput1 = (data) => convertBase(data, 16, 10) * 0.1176470588235;

const parseAnalogInput2 = (data) => convertBase(data, 16, 10) * 0.01647058823;

const parseAnalogInput3 = (data) => (convertBase(data, 16, 10) * 0.4314) - 40;

const parseAnalogInput4 = (data) => convertBase(data, 16, 10);

const parseAltitude = (data) => convertBase(reverseHex(data), 16, 10) * 0.01;

module.exports = {
  parse: parse,
  patterns: patterns,
  isCello: isCello
};
