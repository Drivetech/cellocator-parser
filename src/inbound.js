'use strict';

const utils = require('./utils');
const commands = require('./commands');

const genericCommand = (uId, commandNumeratorField, codefield, firsttwice) => {
  const systemCode = utils.ascii2hex('MCGP');
  const messageType = utils.lpad(utils.convertBase('4', 10, 16));
  const unitId = utils.reverseHex(utils.lpad(utils.convertBase(uId, 10, 16), 8));
  const commandNumerator = utils.lpad(utils.convertBase(commandNumeratorField > 255 ? 0 : commandNumeratorField, 10, 16), 2);
  const authenticationCode = '00000000';
  const commandCodeField = utils.lpad(codefield, 4);
  const firstCommandDataField = utils.lpad(firsttwice, 4);
  const secondCommandDataField = '0000';
  const commandSpecificDataField = '00000000';
  const trama = `${messageType}${unitId}${commandNumerator}${authenticationCode}${commandCodeField}${commandCodeField}${firstCommandDataField}${firstCommandDataField}${secondCommandDataField}${commandSpecificDataField}`;
  const checksum = utils.checksum(trama);
  const command = `${systemCode}${trama}${checksum}`;
  return new Buffer(command, 'hex');
};

exports.ack = (uId, commandNumerator, messageNumerator) => {
  const systemCode = utils.ascii2hex('MCGP');
  const messageType = '04';
  const unitId = utils.reverseHex(utils.lpad(utils.convertBase(uId, 10, 16), 8));
  const commandNumeratorField = utils.lpad(utils.convertBase(commandNumerator > 255 ? 0 : commandNumerator, 10, 16), 2);
  const authenticationCodeField = '00000000';
  const actionCode = '00';
  const mainAckNumberLSB = utils.lpad(utils.convertBase(messageNumerator, 10, 16), 2);
  const mainAckNumberMSB = '00';
  const secundaryAckNumberLSB = '00';
  const secundaryAckNumberMSB = '00';
  const reserve1 = '00';
  const compressDate = '0000';
  const compressTime = '000000';
  const reserve2 = '0000';
  const trama = `${messageType}${unitId}${commandNumeratorField}${authenticationCodeField}${actionCode}${mainAckNumberLSB}${mainAckNumberMSB}${secundaryAckNumberLSB}${secundaryAckNumberMSB}${reserve1}${compressDate}${compressTime}${reserve2}`;
  const checksum = utils.checksum(trama);
  const command = `${systemCode}${trama}${checksum}`;
  return new Buffer(command, 'hex');
};

exports.getCommand = (unitId, commandNumeratorField, type) => {
  const command = commands[type];
  return genericCommand(unitId, commandNumeratorField, command.codeField, command.dataField);
};
