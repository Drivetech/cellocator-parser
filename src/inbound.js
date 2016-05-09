'use strict';

const utils = require('./utils');
const commands = require('./commands');

const genericCommand = (uid, numerator, codefield, firsttwice) => {
  const systemCode = utils.ascii2hex('MCGP');
  const messageType = utils.lpad(utils.convertBase('4', 10, 16));
  const authenticationCode = '00000000';
  const secondCommandDataField = '0000';
  const commandSpecificDataField = '00000000';
  const unitId = utils.reverseHex(utils.lpad(utils.convertBase(uid, 10, 16), 8));
  const commandNumerator = utils.lpad(utils.convertBase(numerator > 255 ? 0 : numerator, 10, 16), 2);
  const commandCodeField = utils.lpad(codefield, 4);
  const firstCommandDataField = utils.lpad(firsttwice, 4);
  const trama = `${messageType}${unitId}${commandNumerator}${authenticationCode}${commandCodeField}${commandCodeField}${firstCommandDataField}${firstCommandDataField}${secondCommandDataField}${commandSpecificDataField}`;
  const checksum = utils.checksum(trama);
  const sendCommand = `${systemCode}${trama}${checksum}`;
  return new Buffer(sendCommand, 'hex');
};

exports.getCommand = (uid, numerator, type) => {
  const command = commands[type];
  return genericCommand(uid, numerator, command.codeField, command.dataField);
};
