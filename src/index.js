'use strict';

const utils = require('./utils');
const inbound = require('./inbound');

const storeIncompleteData = {};

const parse = raw => {
  const rawString = raw.toString('hex');
  if (!utils.patterns.data.test(rawString)) return {type: 'UNKNOWN', raw: rawString};
  const results = rawString.split(utils.patterns.multi).filter(x => utils.patterns.data.test(x)).map(utils.getData);
  const incompleteData = rawString.split(utils.patterns.multi).filter(x => !utils.patterns.data.test(x) && x !== '');
  if (incompleteData.length > 0) {
    const reply = storeIncompleteData[results[0].unitId];
    if (reply) {
      let previousData = '';
      if (/^4d434750/.test(reply)) {
        previousData = new Buffer(`${reply}${incompleteData[0]}`, 'hex');
      } else if (/^4d434750/.test(incompleteData[0])) {
        previousData = new Buffer(`${incompleteData[0]}${reply}`, 'hex');
      }
      if (utils.patterns.data.test(previousData.toString('hex'))) {
        results.unshift(utils.getData(previousData));
      }
    } else {
      storeIncompleteData[results[0].unitId] = incompleteData[0];
    }
  }
  if (results.length === 1) return results[0];
  return results;
};

const isCello = raw => utils.patterns.data.test(raw.toString('hex'));

module.exports = {
  parse: parse,
  patterns: utils.patterns,
  isCello: isCello,
  getImei: utils.getImei,
  ack: inbound.ack,
  parseCommand: inbound.parseCommand
};
