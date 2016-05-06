'use strict';

const tz = require('../src');
const expect = require('chai').expect;

describe('cellocator-parzer', () => {
  it('should return data parsed', () => {
    const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1');
    const data = tz.parse(raw);
    expect(data.raw).to.eql(raw.toString());
    expect(data.device).to.eql('CelloTrack');
    expect(data.type).to.eql('data');
    expect(data.loc.type).to.eql('Point');
    expect(data.loc.coordinates).to.eql([-79.09097658351084, -7.953307941260071]);
    expect(data.speed).to.eql(84.96);
    expect(data.datetime).to.eql('2016-03-12T23:42:00.000Z');
    expect(data.direction).to.eql(155.09967514191385);
    expect(data.satellites).to.eql(9);
    expect(data.voltage.ada).to.eql(28.1176470588165);
    expect(data.voltage.adb).to.eql(4.00235293989);
    expect(data.voltage.adc).to.eql(45.41720000000001);
    expect(data.voltage.add).to.eql(182);
    expect(data.altitude).to.eql(223.23000000000002);
    expect(data.status.engine).to.be.false;
    expect(data.status.unlockInactive).to.be.true;
    expect(data.status.panicInactive).to.be.true;
    expect(data.status.drivingStatus).to.be.true;
    expect(data.status.shockInactive).to.be.true;
    expect(data.status.doorInactive).to.be.true;
    expect(data.status.ignitionPortStatus).to.be.true;
    expect(data.status.accelerometerStatus).to.be.true;
    expect(data.status.lock).to.be.true;
    expect(data.version).to.eql('HW: <224>, SW: <32>');
  });
});