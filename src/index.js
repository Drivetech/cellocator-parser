'use strict';

const utils = require('./utils');
const inbound = require('./inbound');

const patterns = {
  multi: /(4d434750[A-F0-9]{132})/gi,
  data: /(4d434750[A-F0-9]{132})/i
};

const storeIncompleteData = {};

const parse = raw => {
  const rawString = raw.toString('hex');
  if (!patterns.data.test(rawString)) return {type: 'UNKNOWN', raw: rawString};
  const results = rawString.split(patterns.multi).filter(x => patterns.data.test(x)).map(utils.getData);
  const incompleteData = rawString.split(patterns.multi).filter(x => !patterns.data.test(x) && x !== '');
  if (incompleteData.length > 0) {
    const reply = storeIncompleteData[results[0].unitId];
    if (reply) {
      let previousData = '';
      if (/^4d434750/.test(reply)) {
        previousData = new Buffer(`${reply}${incompleteData[0]}`, 'hex');
      } else if (/^4d434750/.test(incompleteData[0])) {
        previousData = new Buffer(`${incompleteData[0]}${reply}`, 'hex');
      }
      if (patterns.data.test(previousData.toString('hex'))) {
        results.unshift(utils.getData(previousData));
      }
    } else {
      storeIncompleteData[results[0].unitId] = incompleteData[0];
    }
  }
  if (results.length === 1) return results[0];
  return results;
};

const isCello = raw => patterns.data.test(raw.toString('hex'));

module.exports = {
  parse: parse,
  patterns: patterns,
  isCello: isCello,
  getImei: utils.getImei,
  ack: inbound.ack,
  parseCommand: inbound.parseCommand
};
