'use strict';

const utils = require('./utils');
const inbound = require('./inbound');
const redis = require('redis');
const Promise = require('bluebird');

let _client;

const patterns = {
  multi: /(4d434750[A-F0-9]{132})/gi,
  data: /(4d434750[A-F0-9]{132})/i
};

const parse = raw => {
  return new Promise((resolve, reject) => {
    const rawString = raw.toString('hex');
    if (!patterns.data.test(rawString)) resolve({type: 'UNKNOWN', raw: rawString});
    const results = rawString.split(patterns.multi).filter(x => patterns.data.test(x)).map(utils.getData);
    if (!_client) {
      if (results.length === 1) resolve(results[0]);
      resolve(results);
    }
    _client.getAsync(`incompleteData:${results[0].unitId}`).then(reply => {
      const incompleteData = rawString.split(patterns.multi).filter(x => !patterns.data.test(x) && x !== '');
      if (incompleteData.length > 0) {
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
          _client.set(`incompleteData:${results[0].unitId}`, incompleteData[0]);
        }
      }
      if (results.length === 1) resolve(results[0]);
      resolve(results);
    }).catch(reject);
  });
};

const isCello = raw => {
  let result = false;
  if (patterns.data.test(raw.toString('hex'))) {
    result = true;
  }
  return result;
};

const setClient = options => {
  options = options || {};
  if (options.client) {
    _client = options.client;
  } else {
    _client = redis.createClient(options);
  }
  Promise.promisifyAll(Object.getPrototypeOf(_client));
};

module.exports = {
  parse: parse,
  patterns: patterns,
  isCello: isCello,
  getImei: utils.getImei,
  ack: inbound.ack,
  setClient: setClient
};
