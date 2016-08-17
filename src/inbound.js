'use strict';

const core = require('./core');
const utils = require('./utils');
const commands = require('./commands');

const genericCommand = (uId, commandNumeratorField, codefield, firsttwice) => {
  const systemCode = utils.ascii2hex('MCGP');
  const messageType = '00';
  const unitId = utils.reverseHex(core.lpad(core.convertBase(uId, 10, 16), 8));
  const commandNumerator = core.lpad(core.convertBase(commandNumeratorField > 255 ? 0 : commandNumeratorField, 10, 16), 2);
  const authenticationCode = '00000000';
  const commandCodeField = core.lpad(codefield, 4);
  const firstCommandDataField = core.lpad(firsttwice, 4);
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
  const unitId = utils.reverseHex(core.lpad(core.convertBase(uId, 10, 16), 8));
  const commandNumeratorField = core.lpad(core.convertBase(commandNumerator > 255 ? 0 : commandNumerator, 10, 16), 2);
  const authenticationCodeField = '00000000';
  const actionCode = '00';
  const mainAckNumberLSB = core.lpad(core.convertBase(messageNumerator, 10, 16), 2);
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

const parseIOCommand = instruction => {
  const outputs = {
    '1': {off: '04', on: '14'},
    '2': {off: '00', on: '10'},
    '3': {off: '05', on: '15'},
    '4': {off: '03', on: '13'},
    '5': {off: '08', on: '18'},
    '6': {off: '09', on: '19'}
  };
  let data = instruction.split('_');
  const port = data[0];
  const state = data[1];
  return {codeField: '03', dataField: outputs[port][state]};
};

const instructionParsers = data => {
  let result = null;
  const parsers = [
    {regex: /^[1-5]{1}_(on|off)$/, parser: parseIOCommand},
  ];
  const parser = parsers.find(x => x.regex.test(data.instruction));
  if (typeof parser === 'undefined') {
    const command = commands[data.type];
    if (typeof command !== 'undefined') result = command;
  } else {
    result = parser.parser(data.instruction);
  }
  return result;
};

exports.parseCommand = data => {
  const command = instructionParsers(data);
  return genericCommand(data.unitId, data.commandNumeratorField, command.codeField, command.dataField);
};
