'use strict';

const ConvertBase = require('convert-base');
const hardwares = require('./hardwares');
const moment = require('moment');
const pad = require('pad');

const convertBase = (data, fromBase , toBase) => {
  const converter = new ConvertBase();
  return converter.convert(data, fromBase, toBase);
};
exports.convertBase = convertBase;

exports.ascii2hex = data => data.split('').map(x => x.charCodeAt(0).toString(16).toUpperCase()).join('');

const reverseHex = data => {
  data = data.toUpperCase();
  if (data.length % 2 !== 0) data = `0${data}`;
  return data.split(/([A-F0-9]{2})/).filter(x => x !== '').reverse().join('');
};
exports.reverseHex = reverseHex;

const lpad = (data, length) => pad(length, data, '0');
exports.lpad = lpad;

const hex2bin = data => lpad(convertBase(data, 16, 2), data.length * 4);

const parseMessageType = byte5 => convertBase(byte5, 16, 10);

const parseUnitsId = bytes6To9 => convertBase(reverseHex(bytes6To9), 16, 10);

const parseCommunication = bytes10To11 => {
  const byte10 = hex2bin(bytes10To11.substring(0, 2));
  const byte11 = hex2bin(bytes10To11.substring(2, 4));
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

const parseMessageNumerator = byte12 => convertBase(byte12, 16, 10);

const parseHardware = byte13 => {
  const data = hex2bin(byte13);
  const modem  = convertBase(data.substr(0, 3), 2, 10);
  const model = convertBase(data.substr(3, 5), 2, 10);
  const hardware = hardwares.find(x => x.model.id === model && x.modem.code === modem);
  return hardware ? hardware.id : '';
};

const parseSoftware = byte14 => convertBase(byte14, 16, 10);

const parseVersion = (byte13, byte14) => `HW: <${parseHardware(byte13)}>, SW: <${parseSoftware(byte14)}>`;

const protocolVersionIdentifier = byte15 => convertBase(byte15, 16, 10);

const parseUnitsStatusCurrentGsmOperator = byte16 => {
  const firstnibble = byte16[0];
  const unitsstatus = convertBase(byte16[1], 16, 2);
  return {
    speedEstimatedByGps: unitsstatus[0] === '1',
    correctTime: unitsstatus[1] === '1',
    homeNetwork: unitsstatus[2] === '1',
    gpsCommunicationAvailable: unitsstatus[3] === '1',
    currentGsmOperator1stNibble: firstnibble
  };
};

const parseCurrentGsmOperator = byte17 => byte17;

const parseTransmissionReasonSpecificData = byte18 => convertBase(byte18, 16, 10);

const parseTransmissionReason = byte19 => convertBase(byte19, 16, 10);

const parseEngineStatus = byte20 => convertBase(byte20, 16, 10);

const parseIO = bytes21To24 => {
  const byte21 = hex2bin(bytes21To24.substring(0, 2));
  const byte22 = hex2bin(bytes21To24.substring(2, 4));
  const byte23 = hex2bin(bytes21To24.substring(4, 6));
  const byte24 = hex2bin(bytes21To24.substring(6, 8));
  return {
    unlockInactive: byte21[0] === '1',
    panicInactive: byte21[1] === '1',
    drivingStatus: byte21[2] === '1',
    shockInactive: byte21[6] === '1',
    doorInactive: byte21[7] === '1',
    ignitionPortStatus: byte22[0] === '1',
    accelerometerStatus: byte22[1] === '1',
    lock: byte22[5] === '1',
    gpsPower: byte23[4] === '1',
    gradualStop: byte23[5] === '1',
    siren: byte23[6] === '1',
    charge: byte24[0] === '1',
    standardImmobilizer: byte24[2] === '1',
    globalOutput: byte24[4] === '1',
    ledOut: byte24[7] === '1'
  };
};

const parsePlmn = (byte25, currentGsmOperator1stNibble, currentGsmOperator) => {
  return convertBase(`${currentGsmOperator1stNibble}${currentGsmOperator}${byte25}`, 16, 10);
};

const parseAnalogInput1 = byte26 => convertBase(byte26, 16, 10) * 0.1176470588235;

const parseAnalogInput2 = byte27 => convertBase(byte27, 16, 10) * 0.01647058823;

const parseAnalogInput3 = byte28 => (convertBase(byte28, 16, 10) * 0.4314) - 40;

const parseAnalogInput4 = byte29 => convertBase(byte29, 16, 10);

const parseMileageCounter = bytes30To32 => convertBase(reverseHex(bytes30To32), 16, 10);

const multiPurposeField = (bytes33To38, byte41) => {
  const ms4And5From41 = hex2bin(byte41).substring(1, 3);
  return parseInt(`${ms4And5From41}${hex2bin(reverseHex(bytes33To38))}`, 2);
};

const parseGpsTime = (bytefrom39to40, seconds) => {
  seconds = lpad(convertBase(seconds, 16, 10), 2);
  const now = moment().format('YYYY-MM');
  const data = hex2bin(reverseHex(bytefrom39to40));
  const day = `00${convertBase(data.substr(0, 5), 2, 10)}`.substr(-2);
  const hours = `00${convertBase(data.substr(5, 5), 2, 10)}`.substr(-2);
  const minutes = `00${convertBase(data.substr(10, 6), 2, 10)}`.substr(-2);
  const datetime = moment(`${now}-${day} ${hours}:${minutes}:${seconds}`);
  return datetime.isValid() ? datetime.toISOString() : null;
};

const parseLocationStatus = byte41 => hex2bin(byte41);

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
  const modes = /([01]{1})([01]{1})([01]{2})([01]{1})([01]{3})/i.exec(hex2bin(byte42));
  const dgps = convertBase(modes[1], 2, 10);
  const dopMask = convertBase(modes[2], 2, 10);
  const altMode = convertBase(modes[3], 2, 10);
  const tpMode = convertBase(modes[4], 2, 10);
  const pMode = convertBase(modes[5], 2, 10);
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

const parseSatellites = byte44 => convertBase(byte44, 16, 10);

const notBinaryData = data => data.split('').map(x => x === '1' ? '0' : '1').join('');

const parseLatitude = bytes45To48 => {
  let lat = 0;
  const data = reverseHex(bytes45To48);
  if (data[0] === 'F') {
    lat = convertBase(notBinaryData(hex2bin(data)), 2, 10);
    lat = (lat + 1) * -1;
  } else {
    lat = convertBase(data, 16, 10);
  }
  return lat * (180 / Math.PI) * Math.pow(10, -8);
};

const parseLongitude = bytes49To52 => {
  let lng = 0;
  const data = reverseHex(bytes49To52);
  if (data[0] === 'F') {
    lng = convertBase(notBinaryData(hex2bin(data)), 2, 10);
    lng = (lng + 1) * -1 * (180 / Math.PI) * Math.pow(10, -8);
  } else {
    lng = convertBase(data, 16, 10);
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

const parseAltitude = bytes53To56 => convertBase(reverseHex(bytes53To56), 16, 10) * 0.01;

const parseSpeed = bytes57To60 => convertBase(reverseHex(bytes57To60), 16, 10) * 0.036;

const parseDirection = bytes61To62 => convertBase(reverseHex(bytes61To62), 16, 10) * (180 / Math.PI) * 0.001;

const parseDatetime = (bytes68To69, byte67, byte66, byte65, byte64, byte63) => {
  const year = lpad(convertBase(reverseHex(bytes68To69), 16, 10), 2);
  const month = lpad(convertBase(byte67, 16, 10), 2);
  const day = lpad(convertBase(byte66, 16, 10), 2);
  const hour = lpad(convertBase(byte65, 16, 10), 2);
  const minute = lpad(convertBase(byte64, 16, 10), 2);
  const second = lpad(convertBase(byte63, 16, 10), 2);
  const date = `${year}${month}${day}${hour}${minute}${second}`;
  const datetime = moment(`${date}+00:00`, 'YYYYMMDDHHmmssZZ');
  return datetime.isValid() ? datetime.toISOString() : null;
};

const checksum = trama => {
  const code = trama.split(/([A-F0-9]{2})/i).filter(x => x !== '').reduce((prev, curr) => prev + convertBase(curr, 16, 10), 0);
  return `00${convertBase(code, 10, 16)}`.substr(-2);
};
exports.checksum = checksum;

const validate = (byte70, bytes4To69) => {
  return checksum(bytes4To69) === byte70;
};

exports.getData = raw => {
  const bytes = raw.toString('hex').split(/([A-F0-9]{2})/i).filter(x => x !== '');
  const seconds = bytes[62];
  const messageType = parseMessageType(bytes[4]);
  const unitId = parseUnitsId(bytes.slice(5, 9).join(''));
  const communication = parseCommunication(bytes.slice(9, 11).join(''));
  const messageNumerator = parseMessageNumerator(bytes[11]);
  const version = parseVersion(bytes[12], bytes[13]);
  const transmissionReason = parseTransmissionReason(bytes[18]);
  const engine = parseEngineStatus(bytes[19]);
  const io = parseIO(bytes.slice(20, 24).join(''));
  const unitsStatusCurrentGsmOperator = parseUnitsStatusCurrentGsmOperator(bytes[15]);
  const currentGsmOperator = parseCurrentGsmOperator(bytes[16]);
  const plmn = parsePlmn(bytes[24], unitsStatusCurrentGsmOperator.currentGsmOperator1stNibble, currentGsmOperator);
  const analog1 = parseAnalogInput1(bytes[25]);
  const analog2 = parseAnalogInput2(bytes[26]);
  const analog3 = parseAnalogInput3(bytes[27]);
  const analog4 = parseAnalogInput4(bytes[28]);
  const odometer = parseMileageCounter(bytes.slice(29, 32).join(''));
  const imei = multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]);
  const gpsTime = parseGpsTime(bytes.slice(38, 40).join(''), seconds);
  const locationStatus = parseLocationStatus(bytes[40]);
  const mode1 = parseMode1(bytes[41]);
  const mode2 = parseMode2(bytes[42]);
  const satellites = parseSatellites(bytes[43]);
  const loc = parseLoc(bytes.slice(44, 48).join(''), bytes.slice(48, 52).join(''));
  const altitude = parseAltitude(bytes.slice(52, 56).join(''));
  const speed = parseSpeed(bytes.slice(56, 60).join(''));
  const direction = parseDirection(bytes.slice(60, 62).join(''));
  const datetime = parseDatetime(bytes.slice(67, 69).join(''), bytes[66], bytes[65], bytes[64], bytes[63], bytes[62]);
  const data = {
    raw: bytes.join(''),
    unitId: unitId,
    imei: imei,
    device: 'CelloTrack',
    type: 'data',
    loc: loc,
    speed: speed,
    datetime: datetime,
    gpsTime: gpsTime,
    direction: direction,
    satellites: satellites,
    voltage: {
      ada: analog1,
      adb: analog2,
      adc: analog3,
      add: analog4
    },
    altitude: altitude,
    status: {
      engine: engine === 1,
      unlockInactive: io.unlockInactive,
      panicInactive: io.panicInactive,
      drivingStatus: io.drivingStatus,
      shockInactive: io.shockInactive,
      doorInactive: io.doorInactive,
      ignitionPortStatus: io.ignitionPortStatus,
      accelerometerStatus: io.accelerometerStatus,
      lock: io.lock,
      noHibernation: communication.noHibernation,
      momentarySpeed: communication.momentarySpeed,
      privateMode: communication.privateMode,
      firmwareSubversion: communication.firmwareSubversion,
      canOriginatedOdometer: communication.canOriginatedOdometer,
      canOriginatedSpeed: communication.canOriginatedSpeed,
      dataType33_38: communication.dataType33_38,
      messageSource: communication.messageSource,
      garminConnected: communication.garminConnected,
      garminEnable: communication.garminEnable,
      messageInitiative: communication.messageInitiative,
      locationStatus: locationStatus,
      charge: io.charge,
      standardImmobilizer: io.standardImmobilizer,
      globalOutput: io.globalOutput,
      ledOut: io.ledOut,
      gpsPower: io.gpsPower,
      gradualStop: io.gradualStop,
      siren: io.siren
    },
    version: version,
    protocolVersionIdentifier: protocolVersionIdentifier(bytes[14]),
    transmissionReason: transmissionReason,
    transmissionReasonSpecificData: parseTransmissionReasonSpecificData(bytes[17]),
    odometer: odometer,
    gpsModes: {
      '1': mode1,
      '2': mode2
    },
    plmn: plmn,
    sn: messageNumerator,
    messageType: messageType,
    valid: validate(bytes[69], bytes.slice(3, 69).join(''))
  };
  return data;
};

exports.getImei = raw => {
  const bytes = raw.toString('hex').split(/([A-F0-9]{2})/i).filter(x => x !== '');
  return multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]);
};
