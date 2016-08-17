'use strict';

const ConvertBase = require('convert-base');
const pad = require('pad');

const convertBase = (data, fromBase , toBase) => {
  const converter = new ConvertBase();
  return converter.convert(data, fromBase, toBase);
};

const lpad = (data, length) => pad(length, data, '0');

const hex2bin = data => lpad(convertBase(data, 16, 2), data.length * 4);

module.exports = {
  convertBase: convertBase,
  lpad: lpad,
  hex2bin: hex2bin
};
