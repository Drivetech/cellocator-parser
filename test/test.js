'use strict';

const lib = require('../src');
const expect = require('chai').expect;

describe('cellocator-parser', () => {
  it('should return data parsed', () => {
    const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1', 'hex');
    const data = lib.parse(raw);
    expect(data.raw).to.eql(raw.toString('hex'));
    expect(data.unitId).to.eql(776893);
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
    expect(data.version).to.eql('HW: <223>, SW: <32>');
  });

  it('should return a valid data cellocator', () => {
    const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1', 'hex');
    const data = lib.isCello(raw);
    expect(data).to.be.true;
  });

  it('should return a valid imei', () => {
    const raw = new Buffer('4d43475000aac30c00000afc4e2104161d002001c30400002a69e193b600000042f7830fea440000a00000000000000000000000000000000000000000001f13111106e007a4', 'hex');
    const data = lib.getImei(raw);
    expect(data).to.eql(357247050053442);
  });

  it('should return a ACK command', () => {
    const unitId = 836522;
    const commandNumerator = 1;
    const messageNumerator = 80;
    const ack = lib.ack(unitId, commandNumerator, messageNumerator);
    expect(ack).to.eql(new Buffer('4D43475004AAC30C00010000000000500000000000000000000000CE', 'hex'));
  });

  it('should return 4 data parsed', () => {
    const raw = new Buffer('4d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081825eb2904151d00410021b300812967e5fe970000005c530524c7420000a00000000000000000000000000000000000000000002321050e0100007d4d43475000b8ac1100081826eb2904151d00310023b308802966e5fe970000005c530524c7420000a00000000000000000000000000000000000000000002621050e010000794d43475000b8ac1100081827eb2904151d002c0023b300802966e6fe970000005c530524c7420000a00000000000000000000000000000000000000000002921050e010000714d43475000b8ac1100081828eb2904151d004100', 'hex');
    const results = lib.parse(raw);
    expect(results).to.have.lengthOf(4);
    expect(results[0].raw).to.eql(raw.toString('hex').substr(0, 140));
    expect(results[0].unitId).to.eql(1158328);
    expect(results[0].device).to.eql('CelloTrack');
    expect(results[0].type).to.eql('data');
    expect(results[0].loc.type).to.eql('Point');
    expect(results[0].loc.coordinates).to.eql([0, 0]);
    expect(results[0].speed).to.eql(0);
    expect(results[0].datetime).to.eql(null);
    expect(results[0].direction).to.eql(0);
    expect(results[0].satellites).to.eql(0);
    expect(results[0].voltage.ada).to.eql(12.235294117644);
    expect(results[0].voltage.adb).to.eql(3.65647058706);
    expect(results[0].voltage.adc).to.eql(69.57560000000001);
    expect(results[0].voltage.add).to.eql(152);
    expect(results[0].altitude).to.eql(0);
    expect(results[0].status.engine).to.be.true;
    expect(results[0].status.unlockInactive).to.be.false;
    expect(results[0].status.panicInactive).to.be.false;
    expect(results[0].status.drivingStatus).to.be.true;
    expect(results[0].status.shockInactive).to.be.true;
    expect(results[0].status.doorInactive).to.be.true;
    expect(results[0].status.ignitionPortStatus).to.be.true;
    expect(results[0].status.accelerometerStatus).to.be.false;
    expect(results[0].status.lock).to.be.false;
    expect(results[0].version).to.eql('HW: <235>, SW: <41>');
  });
});
