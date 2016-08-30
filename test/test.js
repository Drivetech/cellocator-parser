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
    expect(data.alarm.type).to.eql('ConnectionUp');
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
    expect(data.status.input['1']).to.be.false;
    expect(data.status.input['2']).to.be.false;
    expect(data.status.input['3']).to.be.false;
    expect(data.status.input['4']).to.be.false;
    expect(data.status.input['5']).to.be.true;
    expect(data.status.output['1']).to.be.false;
    expect(data.status.output['2']).to.be.false;
    expect(data.status.output['3']).to.be.false;
    expect(data.status.output['4']).to.be.false;
    expect(data.status.output['5']).to.be.false;
    expect(data.status.output['6']).to.be.false;
    expect(data.status.sos).to.be.false;
    expect(data.status.engine).to.be.false;
    expect(data.status.driving).to.be.false;
    expect(data.status.accelerometer).to.be.true;
    expect(data.hardware.model).to.eql('Cello-IQ');
    expect(data.hardware.modem).to.eql('Telit GE864, automative');
    expect(data.valid).to.be.true;
  });

  it('should return a valid data cellocator', () => {
    const raw = new Buffer('4d43475000bdda0b0000060ddf20041017002000e3c40000baeff3c6b6224502000000000000ea65000402090daec5f7cb302cff3357000038090000930a002a170c03e007c1', 'hex');
    const data = lib.isCello(raw);
    expect(data).to.be.true;
  });

  it('should return a null imei', () => {
    const raw = new Buffer('lkjsdlkajsdlaksdjalskdjaslkdj');
    const data = lib.getImei(raw);
    expect(data).to.be.null;
  });

  it('should return a valid imei', () => {
    const raw = new Buffer('4d43475000aac30c00000afc4e2104161d002001c30400002a69e193b600000042f7830fea440000a00000000000000000000000000000000000000000001f13111106e007a4', 'hex');
    const data = lib.getImei(raw);
    expect(data).to.eql('357247050053442');
  });

  it('should return a ACK command', () => {
    const unitId = 836522;
    const commandNumerator = 1;
    const messageNumerator = 80;
    const ack = lib.ack(unitId, commandNumerator, messageNumerator);
    expect(ack).to.eql(new Buffer('4D43475004AAC30C00010000000000500000000000000000000000CE', 'hex'));
  });

  it('should return first 4 data and save partial data. Then return 5 data', () => {
    const raw1 = new Buffer('4d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d004501', 'hex');
    const raw2 = new Buffer('23b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f34d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f3', 'hex');
    const results1 = lib.parse(raw1);
    expect(results1).to.have.lengthOf(4);
    expect(results1[0].raw).to.eql(raw1.toString('hex').substr(0, 140));
    expect(results1[0].unitId).to.eql(1158328);
    expect(results1[0].device).to.eql('CelloTrack');
    expect(results1[0].alarm.type).to.eql('Driving');
    expect(results1[0].type).to.eql('data');
    expect(results1[0].loc.type).to.eql('Point');
    expect(results1[0].loc.coordinates).to.eql([0, 0]);
    expect(results1[0].speed).to.eql(0);
    expect(results1[0].datetime).to.eql(null);
    expect(results1[0].direction).to.eql(0);
    expect(results1[0].satellites).to.eql(0);
    expect(results1[0].voltage.ada).to.eql(12.235294117644);
    expect(results1[0].voltage.adb).to.eql(3.65647058706);
    expect(results1[0].voltage.adc).to.eql(69.57560000000001);
    expect(results1[0].voltage.add).to.eql(152);
    expect(results1[0].altitude).to.eql(0);
    expect(results1[0].status.input['1']).to.be.false;
    expect(results1[0].status.input['2']).to.be.false;
    expect(results1[0].status.input['3']).to.be.true;
    expect(results1[0].status.input['4']).to.be.true;
    expect(results1[0].status.input['5']).to.be.true;
    expect(results1[0].status.output['1']).to.be.false;
    expect(results1[0].status.output['2']).to.be.false;
    expect(results1[0].status.output['3']).to.be.false;
    expect(results1[0].status.output['4']).to.be.false;
    expect(results1[0].status.output['5']).to.be.false;
    expect(results1[0].status.output['6']).to.be.false;
    expect(results1[0].status.sos).to.be.true;
    expect(results1[0].status.engine).to.be.true;
    expect(results1[0].status.driving).to.be.false;
    expect(results1[0].status.accelerometer).to.be.false;
    expect(results1[0].hardware.model).to.eql('CR300B');
    expect(results1[0].hardware.modem).to.eql('GE864-QUAD-V2');
    expect(results1[0].valid).to.be.true;
    const results2 = lib.parse(raw2);
    expect(results2).to.have.lengthOf(5);
    expect(results2[0].raw).to.eql('4d43475000b8ac1100081824eb2904151d00450123b300002968defe980000005c530524c7420000a00000000000000000000000000000000000000000001921050e010000f3');
    expect(results2[1].raw).to.eql(raw1.toString('hex').substr(0, 140));
    expect(results2[1].unitId).to.eql(1158328);
    expect(results2[1].device).to.eql('CelloTrack');
    expect(results2[1].alarm.type).to.eql('Driving');
    expect(results2[1].type).to.eql('data');
    expect(results2[1].loc.type).to.eql('Point');
    expect(results2[1].loc.coordinates).to.eql([0, 0]);
    expect(results2[1].speed).to.eql(0);
    expect(results2[1].datetime).to.eql(null);
    expect(results2[1].direction).to.eql(0);
    expect(results2[1].satellites).to.eql(0);
    expect(results2[1].voltage.ada).to.eql(12.235294117644);
    expect(results2[1].voltage.adb).to.eql(3.65647058706);
    expect(results2[1].voltage.adc).to.eql(69.57560000000001);
    expect(results2[1].voltage.add).to.eql(152);
    expect(results2[1].altitude).to.eql(0);
    expect(results2[1].status.input['1']).to.be.false;
    expect(results2[1].status.input['2']).to.be.false;
    expect(results2[1].status.input['3']).to.be.true;
    expect(results2[1].status.input['4']).to.be.true;
    expect(results2[1].status.input['5']).to.be.true;
    expect(results2[1].status.output['1']).to.be.false;
    expect(results2[1].status.output['2']).to.be.false;
    expect(results2[1].status.output['3']).to.be.false;
    expect(results2[1].status.output['4']).to.be.false;
    expect(results2[1].status.output['5']).to.be.false;
    expect(results2[1].status.output['6']).to.be.false;
    expect(results2[1].status.sos).to.be.true;
    expect(results2[1].status.engine).to.be.true;
    expect(results2[1].status.driving).to.be.false;
    expect(results2[1].status.accelerometer).to.be.false;
    expect(results2[1].hardware.model).to.eql('CR300B');
    expect(results2[1].hardware.modem).to.eql('GE864-QUAD-V2');
    expect(results2[1].valid).to.be.true;
  });

  it('should return a generic command', () => {
    const unitId = 836522;
    const commandNumerator = 1;
    const messageNumerator = 80;
    const ack = lib.ack(unitId, commandNumerator, messageNumerator);
    expect(ack).to.eql(new Buffer('4D43475004AAC30C00010000000000500000000000000000000000CE', 'hex'));
  });
});
