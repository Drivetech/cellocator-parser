'use strict';

const utils = require('./utils');
const inbound = require('./inbound');

const patterns = {
  data: /(4d434750[A-F0-9]{132})/gi
};

const getData = raw => {
  const bytes = raw.toString('hex').split(/([A-F0-9]{2})/i).filter(x => x !== '');
  const seconds = bytes[62];
  const messageType = utils.parseMessageType(bytes[4]);
  const unitId = utils.parseUnitsId(bytes.slice(5, 9).join(''));
  const communication = utils.parseCommunication(bytes.slice(9, 11).join(''));
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
  const imei = utils.multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]);
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
    transmissionReason: transmissionReason,
    odometer: odometer,
    gpsModes: {
      '1': mode1,
      '2': mode2
    },
    plmn: plmn,
    sn: messageNumerator,
    messageType: messageType
  };
  return data;
};

const parse = raw => {
  const rawString = raw.toString('hex');
  let result = {type: 'UNKNOWN', raw: rawString};
  if (patterns.data.test(rawString)) {
    result = rawString.split(patterns.data).filter(x => patterns.data.test(x)).map(getData);
    if (result.length === 1) result = result[0];
  }
  return result;
};

const isCello = raw => {
  let result = false;
  if (patterns.data.test(raw.toString('hex'))) {
    result = true;
  }
  return result;
};

const getImei = raw => {
  const bytes = raw.toString('hex').split(/([A-F0-9]{2})/i).filter(x => x !== '');
  return utils.multiPurposeField(bytes.slice(32, 38).join(''), bytes[40]);
};

module.exports = {
  parse: parse,
  patterns: patterns,
  isCello: isCello,
  getImei: getImei,
  ack: inbound.ack
};
