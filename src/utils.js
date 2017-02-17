'use strict';

const hardwares = require('./hardwares');
const core = require('./core');
const parseAlarm = require('./alarms');
const isValid = require('date-fns/is_valid');
const format = require('date-fns/format');

const patterns = {
  multi: /(4d434750[A-F0-9]{132})/gi,
  data: /(4d434750[A-F0-9]{132})/i
};

const ascii2hex = data => data.split('').map(x => x.charCodeAt(0).toString(16).toUpperCase()).join('');

const reverseHex = data => {
  data = data.toUpperCase();
  if (data.length % 2 !== 0) data = `0${data}`;
  return data.split(/([A-F0-9]{2})/).filter(x => x !== '').reverse().join('');
};

const parseMessageType = byte5 => core.convertBase(byte5, 16, 10);

const parseUnitsId = bytes6To9 => core.convertBase(reverseHex(bytes6To9), 16, 10);

const parseCommunication = bytes10To11 => {
  const byte10 = core.hex2bin(bytes10To11.substring(0, 2));
  const byte11 = core.hex2bin(bytes10To11.substring(2, 4));
  return {
    noHibernation: byte11[0] === '1',
    momentarySpeed: byte11[1] === '1',
    privateMode: byte11[2] === '1',
    firmwareSubversion: byte11.substring(3, 7),
    canOriginatedOdometer: byte10[0] === '1',
    canOriginatedSpeed: byte10[1] === '1',
    dataType33_38: byte10.substring(2, 3),
    messageSource: byte10[4],
    garminConnected: byte10[5] === '1',
    garminEnable: byte10[6] === '1',
    messageInitiative: byte10[7] === '1'
  };
};

const parseMessageNumerator = byte12 => core.convertBase(byte12, 16, 10);

const parseHardware = byte13 => {
  const data = core.hex2bin(byte13);
  const modem  = core.convertBase(data.substr(0, 3), 2, 10);
  const model = core.convertBase(data.substr(3, 5), 2, 10);
  const hardware = hardwares.find(x => x.model.id === model && x.modem.code === modem);
  return {
    id: hardware.model.id,
    model: hardware.model.name,
    modem: hardware.modem.name
  };
};

const parseSoftware = byte14 => {
  return core.convertBase(byte14, 16, 10);
};

const protocolVersion = byte15 => core.convertBase(byte15, 16, 10);

const parseUnitsStatusCurrentGsmOperator = byte16 => {
  const firstnibble = byte16[0];
  const unitsstatus = core.convertBase(byte16[1], 16, 2);
  return {
    speedEstimatedByGps: unitsstatus[0] === '1',
    correctTime: unitsstatus[1] === '1',
    homeNetwork: unitsstatus[2] === '1',
    gpsCommunicationAvailable: unitsstatus[3] === '1',
    currentGsmOperator1stNibble: firstnibble
  };
};

const parseCurrentGsmOperator = byte17 => byte17;

const parseTransmissionReasonSpecificData = byte18 => core.convertBase(byte18, 16, 10);

const parseTransmissionReason = byte19 => core.convertBase(byte19, 16, 10);

const parseEngineStatus = byte20 => core.convertBase(byte20, 16, 10) === 1;

const parseIO = bytes21To24 => {
  const byte21 = core.hex2bin(bytes21To24.substring(0, 2));
  const byte22 = core.hex2bin(bytes21To24.substring(2, 4));
  const byte23 = core.hex2bin(bytes21To24.substring(4, 6));
  const byte24 = core.hex2bin(bytes21To24.substring(6, 8));
  return {
    unlock: byte21[0] === '0',
    sos: byte21[1] === '0',
    driving: byte21[2] === '0',
    shock: byte21[6] === '0',
    door: byte21[7] === '0',
    ignition: byte22[0] === '1',
    accelerometer: byte22[1] === '1',
    lock: byte22[5] === '0',
    gpsPower: byte23[4] === '1',
    gradualStop: byte23[5] === '1',
    siren: byte23[6] === '1',
    cfeOut1: byte23[7] === '1',
    charge: byte24[0] === '1',
    standardImmobilizer: byte24[2] === '1',
    blinker: byte24[4] === '1',
    ledOut: byte24[7] === '1'
  };
};

const parsePlmn = (byte25, currentGsmOperator1stNibble, currentGsmOperator) => {
  return core.convertBase(`${currentGsmOperator1stNibble}${currentGsmOperator}${byte25}`, 16, 10);
};

const parseAnalogInput1 = byte26 => core.convertBase(byte26, 16, 10) * 0.1176470588235;

const parseAnalogInput2 = byte27 => core.convertBase(byte27, 16, 10) * 0.01647058823;

const parseAnalogInput3 = byte28 => (core.convertBase(byte28, 16, 10) * 0.4314) - 40;

const parseAnalogInput4 = byte29 => core.convertBase(byte29, 16, 10);

const parseMileageCounter = bytes30To32 => core.convertBase(reverseHex(bytes30To32), 16, 10);

const multiPurposeField = (bytes33To38, byte41) => {
  const ms4And5From41 = core.hex2bin(byte41).substring(1, 3);
  return parseInt(`${ms4And5From41}${core.hex2bin(reverseHex(bytes33To38))}`, 2);
};

const parseGpsTime = (bytefrom39to40, seconds) => {
  seconds = core.lpad(core.convertBase(seconds, 16, 10), 2);
  const now = format(new Date(), 'YYYY-MM');
  const data = core.hex2bin(reverseHex(bytefrom39to40));
  const day = `00${core.convertBase(data.substr(0, 5), 2, 10)}`.substr(-2);
  const hours = `00${core.convertBase(data.substr(5, 5), 2, 10)}`.substr(-2);
  const minutes = `00${core.convertBase(data.substr(10, 6), 2, 10)}`.substr(-2);
  const datetime = new Date(`${now}-${day}T${hours}:${minutes}:${seconds}`);
  return isValid(datetime) ? datetime.toISOString() : null;
};

const parseLocationStatus = byte41 => {
  const data = core.hex2bin(byte41);
  const CFETypes = {
    '000': 'Not Applicable',
    '001': 'CFE is not connected',
    '010': 'CFE BT is connected',
    '011': 'CFE Basic is connected',
    '100': 'CFE I/O is connected',
    '101': 'CFE premium is connected',
    '111': 'Undefined CFE Type'
  };
  return {
    GNSSAntennaSelected: data[7] === '0' ? 'internal' : 'external',
    trailer: data[6] === '1',
    CFEType: CFETypes[data.substring(3, 6)]
  };
};

/*
With Normal PMODE Filter settings, PMODE valid is 2 to 6
With Tide PMODE Filter settings PMODE valid 3 or 4
*/
const parseMode1 = byte42 => {
  const pModes = {
    '0': 'No navigation solution',
    '1': '1 satellite solution',
    '2': '2 satellite solution',
    '3': '3 satellite solution',
    '4': '>3 satellite solution',
    '5': '2D point solution (Least square)',
    '6': '3D point solution (Least square)',
    '7': 'Dead reckoning'
  };
  const tpModes = {
    '0': 'Full power position',
    '1': 'Trickle power position'
  };
  const altModes = {
    '0': 'No altitude hold',
    '1': 'Altitude used from filter',
    '2': 'Altitude used from user',
    '3': 'Force altitude (from user)'
  };
  const dopMasks = {
    '0': 'DOP mask not exceeded',
    '1': 'DOP mask exceeded'
  };
  const dgpss = {
    '0': 'No DGPS position',
    '1': 'DGPS position'
  };
  const modes = /([01]{1})([01]{1})([01]{2})([01]{1})([01]{3})/i.exec(core.hex2bin(byte42));
  const dgps = core.convertBase(modes[1], 2, 10);
  const dopMask = core.convertBase(modes[2], 2, 10);
  const altMode = core.convertBase(modes[3], 2, 10);
  const tpMode = core.convertBase(modes[4], 2, 10);
  const pMode = core.convertBase(modes[5], 2, 10);
  return {
    pMode: pModes[pMode],
    tpMode: tpModes[tpMode],
    altMode: altModes[altMode],
    dopMask: dopMasks[dopMask],
    dgps: dgpss[dgps]
  };
};

const parseMode2 = byte43 => {
  const modes = {
    '00': 'Solution not validated',
    '01': 'DR Sensor Data',
    '02': 'Validated',
    '04': 'Dead Reckoning',
    '08': 'Output edited by UI',
    '10': 'Reserved',
    '20': 'Reserved',
    '40': 'Reserved',
    '80': 'Reserved'
  };
  return byte43 in modes ? modes[byte43] : null;
};

const parseSatellites = byte44 => core.convertBase(byte44, 16, 10);

const notBinaryData = data => data.split('').map(x => x === '1' ? '0' : '1').join('');

const parseLatitude = bytes45To48 => {
  let lat = 0;
  const data = reverseHex(bytes45To48);
  if (data[0] === 'F') {
    lat = core.convertBase(notBinaryData(core.hex2bin(data)), 2, 10);
    lat = (lat + 1) * -1;
  } else {
    lat = core.convertBase(data, 16, 10);
  }
  return lat * (180 / Math.PI) * Math.pow(10, -8);
};

const parseLongitude = bytes49To52 => {
  let lng = 0;
  const data = reverseHex(bytes49To52);
  if (data[0] === 'F') {
    lng = core.convertBase(notBinaryData(core.hex2bin(data)), 2, 10);
    lng = (lng + 1) * -1 * (180 / Math.PI) * Math.pow(10, -8);
  } else {
    lng = core.convertBase(data, 16, 10);
    lng = lng * (180 / Math.PI) * Math.pow(10, -9);
  }
  return lng;
};

const parseLoc = (bytes45To48, bytes49To52) => {
  return {
    type: 'Point',
    coordinates: [parseLongitude(bytes45To48), parseLatitude(bytes49To52)]
  };
};

const parseAltitude = bytes53To56 => core.convertBase(reverseHex(bytes53To56), 16, 10) * 0.01;

const parseSpeed = bytes57To60 => core.convertBase(reverseHex(bytes57To60), 16, 10) * 0.036;

const parseDirection = bytes61To62 => core.convertBase(reverseHex(bytes61To62), 16, 10) * (180 / Math.PI) * 0.001;

const parseDatetime = (bytes68To69, byte67, byte66, byte65, byte64, byte63) => {
  const year = core.lpad(core.convertBase(reverseHex(bytes68To69), 16, 10), 2);
  const month = core.lpad(core.convertBase(byte67, 16, 10), 2);
  const day = core.lpad(core.convertBase(byte66, 16, 10), 2);
  const hour = core.lpad(core.convertBase(byte65, 16, 10), 2);
  const minute = core.lpad(core.convertBase(byte64, 16, 10), 2);
  const second = core.lpad(core.convertBase(byte63, 16, 10), 2);
  const datetime = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+00:00`);
  return isValid(datetime) ? datetime.toISOString() : null;
};

const checksum = trama => {
  const code = trama.split(/([A-F0-9]{2})/i).filter(x => x !== '').reduce((prev, curr) => prev + core.convertBase(curr, 16, 10), 0);
  return `00${core.convertBase(code, 10, 16)}`.toUpperCase().substr(-2);
};

const validate = (byte70, bytes4To69) => {
  return checksum(bytes4To69) === byte70.toUpperCase();
};

const getData = raw => {
  const bytes = raw.toString('hex').split(/([A-F0-9]{2})/i).filter(x => x !== '');
  const seconds = bytes[62];
  const io = parseIO(bytes.slice(20, 24).join(''));
  const unitsStatusCurrentGsmOperator = parseUnitsStatusCurrentGsmOperator(bytes[15]);
  const currentGsmOperator = parseCurrentGsmOperator(bytes[16]);
  return {
    raw: bytes.join(''),
    unitId: parseUnitsId(bytes.slice(5, 9).join('')),
    imei: multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]),
    manufacturer: 'cellocator',
    device: 'CelloTrack',
    type: 'data',
    alarm: parseAlarm(bytes[18], bytes[17]),
    loc: parseLoc(bytes.slice(44, 48).join(''), bytes.slice(48, 52).join('')),
    speed: parseSpeed(bytes.slice(56, 60).join('')),
    datetime: parseDatetime(bytes.slice(67, 69).join(''), bytes[66], bytes[65], bytes[64], bytes[63], bytes[62]),
    gpsTime: parseGpsTime(bytes.slice(38, 40).join(''), seconds),
    direction: parseDirection(bytes.slice(60, 62).join('')),
    satellites: parseSatellites(bytes[43]),
    voltage: {
      ada: parseAnalogInput1(bytes[25]),
      adb: parseAnalogInput2(bytes[26]),
      adc: parseAnalogInput3(bytes[27]),
      add: parseAnalogInput4(bytes[28])
    },
    altitude: parseAltitude(bytes.slice(52, 56).join('')),
    status: {
      sos: io.sos,
      input: {
        '1': io.door,
        '2': io.shock,
        '3': io.unlock,
        '4': io.lock,
        '5': io.ignition
      },
      output: {
        '1': io.blinker,
        '2': io.siren,
        '3': io.standardImmobilizer,
        '4': io.gradualStop,
        '5': io.ledOut,
        '6': io.cfeOut1
      },
      charge: io.charge,
      engine: parseEngineStatus(bytes[19]),
      driving: io.driving,
      accelerometer: io.accelerometer,
      gpsPower: io.gpsPower
    },
    communication: parseCommunication(bytes.slice(9, 11).join('')),
    locationStatus: parseLocationStatus(bytes[40]),
    hardware: parseHardware(bytes[12]),
    software: parseSoftware(bytes[13]),
    protocol: protocolVersion(bytes[14]),
    transmissionReason: parseTransmissionReason(bytes[18]),
    transmissionReasonSpecificData: parseTransmissionReasonSpecificData(bytes[17]),
    odometer: parseMileageCounter(bytes.slice(29, 32).join('')),
    gpsModes: {
      '1': parseMode1(bytes[41]),
      '2': parseMode2(bytes[42])
    },
    plmn: parsePlmn(bytes[24], unitsStatusCurrentGsmOperator.currentGsmOperator1stNibble, currentGsmOperator),
    serialId: parseMessageNumerator(bytes[11]),
    messageType: parseMessageType(bytes[4]),
    valid: validate(bytes[69], bytes.slice(4, 69).join(''))
  };
};

const getImei = raw => {
  let imei = null;
  const data = raw.toString('hex');
  if (patterns.data.test(data)) {
    const bytes = data.split(/([A-F0-9]{2})/i).filter(x => x !== '');
    imei = multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]);
  }
  return imei ? imei.toString() : null;
};

module.exports = {
  patterns: patterns,
  ascii2hex: ascii2hex,
  reverseHex: reverseHex,
  checksum: checksum,
  getData: getData,
  getImei: getImei,
};
