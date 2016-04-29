'use strict';

const utils = require('./utils');

const patterns = {
  data: /^([A-F0-9]{140})$/i
};

const getData = (raw) => {
  const bytes = raw.toString().split(/([A-F0-9]{2})/i).filter(x => x !== '');
  const seconds = bytes[62];
  const {
    garminDisabled,
    garminNotConnected,
    directFromRam,
    pspModeIsEnabled,
    notCanOriginatedSpeed,
    notCanOriginatedOdometer,
    activeTransmission,
    noHibernation,
    momentarySpeed,
    h
  } = utils.parseCommunication(bytes.slice(9, 11).join(''));
  const messageNumerator = utils.parseMessageNumerator(bytes[11]);
  const version = utils.parseVersion(bytes[12], bytes[13]);
  const transmissionReason = utils.parseTransmissionReason(bytes[18]);
  const engine = utils.parseEngineStatus(bytes[19]);
  const io = utils.parseIO(bytes.slice(20, 24).join(''));
  const unitsStatusCurrentGsmOperator = utils.parseUnitsStatusCurrentGsmOperator(bytes[15]);
  const currentGsmOperator = utils.parseCurrentGsmOperator(bytes[16]);
  const plmn = utils.parsePlmn(bytes[24], unitsStatusCurrentGsmOperator.currentGsmOperator1stNibble, currentGsmOperator);
  const analog1 = utils.parseAnalogInput1(bytes[25]);
  const analog2 = utils.parseAnalogInput2(bytes[26]);
  const analog3 = utils.parseAnalogInput3(bytes[27]);
  const analog4 = utils.parseAnalogInput4(bytes[28]);
  const odometer = utils.parseMileageCounter(bytes.slice(29, 32).join(''));
  const gpsTime = utils.parseGpsTime(bytes.slice(38, 40).join(''), seconds);
  const locationStatus = utils.parseLocationStatus(bytes[40]);
  const mode1 = utils.parseMode1(bytes[41]);
  const mode2 = utils.parseMode2(bytes[42]);
  const satellites = utils.parseSatellites(bytes[43]);
  const loc = utils.parseLoc(bytes.slice(44, 48).join(''), bytes.slice(48, 52).join(''));
  const altitude = utils.parseAltitude(bytes.slice(52, 56).join(''));
  const speed = utils.parseSpeed(bytes.slice(56, 60).join(''));
  const direction = utils.parseDirection(bytes.slice(60, 62).join(''));
  const datetime = utils.parseDatetime(bytes.slice(67, 69).join(''), bytes[66], bytes[65], bytes[64], bytes[63], bytes[62]);
  const data = {
    raw: bytes.join(''),
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
      unlockInactive: io.unlockInactive,
      panicInactive: io.panicInactive,
      drivingStatus: io.drivingStatus,
      shockInactive: io.shockInactive,
      doorInactive: io.doorInactive,
      ignitionPortStatus: io.ignitionPortStatus,
      accelerometerStatus: io.accelerometerStatus,
      lock: io.lock,
      garminDisabled: garminDisabled === '1',
      garminNotConnected: garminNotConnected === '1',
      directFromRam: directFromRam === '1',
      pspModeIsEnabled: pspModeIsEnabled,
      notCanOriginatedSpeed: notCanOriginatedSpeed === '1',
      notCanOriginatedOdometer: notCanOriginatedOdometer === '1',
      activeTransmission: activeTransmission === '1',
      noHibernation: noHibernation === '1',
      momentarySpeed: momentarySpeed === '1',
      h: h,
      locationStatus: locationStatus,
      charge: io.charge,
      standardImmobilizer: io.standardImmobilizer,
      globalOutput: io.globalOutput,
      ledOut: io.ledOut,
      gpsPower: io.gpsPower,
      gradualStop: io.gradualStop,
      siren: io.siren
    },
    version: version || null,
    transmissionReason: transmissionReason || null,
    odometer: odometer,
    modes: {
      '1': mode1,
      '2': mode2
    },
    plmn: plmn,
    messageNumerator: messageNumerator
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

module.exports = {
  parse: parse,
  patterns: patterns,
  isCello: isCello
};
