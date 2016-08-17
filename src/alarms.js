'use strict';

const core = require('./core');

module.exports = (transmissionReason, transmissionReasonSpecificData) => {
  const tx = core.convertBase(transmissionReason, 16, 10);
  const txDataDec = core.convertBase(transmissionReasonSpecificData, 16, 10);
  const txDataBin = core.hex2bin(transmissionReasonSpecificData);
  let alarm = {};
  switch (tx) {
  case 4:
    alarm = {type: 'EmergencyMode'};
    break;
  case 5:
    alarm = {type: 'DoorOpened'};
    break;
  case 6:
    alarm = {type: 'Engine', status: true};
    break;
  case 7:
    alarm = {type: 'Gps_Status', status: false};
    break;
  case 8:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Towing', status: 'Init'};
      break;
    case 1:
      alarm = {type: 'Towing', status: 'Start'};
      break;
    case 2:
      alarm = {type: 'Towing', status: 'End'};
      break;
    }
    break;
  case 9:
    switch (txDataBin) {
    case '00000001':
      alarm = {type: 'Robbery', status: 'Driving'};
      break;
    case '00000010':
      alarm = {type: 'Robbery', status: 'Stationary'};
      break;
    case '00000100':
      alarm = {type: 'Robbery', status: 'DriverDoor'};
      break;
    case '00001000':
      alarm = {type: 'Robbery', status: 'NearDriverDoor'};
      break;
    case '00010000':
      alarm = {type: 'Robbery', status: 'ImmobilizationStarted'};
      break;
    case '00100000':
      alarm = {type: 'Robbery', status: 'ImmobilizationEnded'};
      break;
    case '01000000':
      alarm = {type: 'Robbery', status: 'StationarySuspended'};
      break;
    default:
      alarm = {type: 'Robbery'};
    }
    break;
  case 11:
    alarm = {type: 'CommunicationIdle'};
    break;
  case 12:
    alarm = {type: 'Disarmed'};
    break;
  case 13:
    alarm = {type: 'KeypadLocked'};
    break;
  case 14:
    switch (txDataBin[0]) {
    case '0':
      alarm = {type: 'GarageMode', status: true};
      break;
    case '1':
      switch (txDataBin.substr(1, 2)) {
      case '00':
        alarm = {type: 'GarageMode', status: false, reason: 'manual'};
        break;
      case '01':
        alarm = {type: 'GarageMode', status: false, reason: 'timeout'};
        break;
      default:
        alarm = {type: 'GarageMode'};
      }
      break;
    default:
      alarm = {type: 'GarageMode'};
    }
    break;
  case 15:
    alarm = {
      type: 'CrashDetection',
      rms: core.convertBase(txDataBin.substr(4), 2, 10) + 1,
      level: txDataBin[3] === 1 ? 'heavy' : 'ligth'
    };
    break;
  case 19:
    alarm = {type: 'AlarmByLock'};
    break;
  case 21:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'CoastingDetection', status: false};
      break;
    case 1:
      alarm = {type: 'CoastingDetection', status: true};
      break;
    default:
      alarm = {type: 'CoastingDetection'};
    }
    break;
  case 22:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'ViolationFirstGPFrequency', status: 'failling'};
      break;
    case 1:
      alarm = {type: 'ViolationFirstGPFrequency', status: 'raising'};
      break;
    default:
      alarm = {type: 'ViolationFirstGPFrequency'};
    }
    break;
  case 23:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'ViolationSecondGPFrequency', status: 'failling'};
      break;
    case 1:
      alarm = {type: 'ViolationSecondGPFrequency', status: 'raising'};
      break;
    default:
      alarm = {type: 'ViolationSecondGPFrequency'};
    }
    break;
  case 25:
    alarm = {type: 'SpeedIgnitionOff'};
    break;
  case 27:
    alarm = {type: 'Gps_Status', status: true};
    break;
  case 31:
    alarm = {type: 'ReplyCommand'};
    break;
  case 32:
    alarm = {type: 'ConnectionUp'};
    break;
  case 33:
    alarm = {type: 'GpsNavigation', status: true};
    break;
  case 34:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Over_Speed', status: true, mode: 'plain'};
      break;
    case 1:
      alarm = {type: 'Over_Speed', status: true, mode: 'threshold'};
      break;
    default:
      alarm = {type: 'Over_Speed', status: true};
    }
    break;
  case 35:
    alarm = {type: 'IdleSpeed', status: true};
    break;
  case 36:
    alarm = {type: 'Distance'};
    break;
  case 37:
    alarm = {type: 'DI', number: 5, status: true};
    break;
  case 38:
    alarm = {type: 'GpsFactoryReset'};
    break;
  case 40:
    alarm = {type: 'IpDown'};
    break;
  case 41:
    alarm = {type: 'GpsNavigation', status: false};
    break;
  case 42:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Over_Speed', status: false, mode: 'plain'};
      break;
    case 1:
      alarm = {type: 'Over_Speed', status: false, mode: 'threshold'};
      break;
    default:
      alarm = {type: 'Over_Speed', status: false};
    }
    break;
  case 43:
    alarm = {type: 'IdleSpeed', status: false};
    break;
  case 44:
    alarm = {type: 'Gps'};
    break;
  case 45:
    alarm = {type: 'DI', number: 5, status: false};
    break;
  case 46:
    alarm = {
      type: 'DriverAuthentication',
      status: true,
      driver: txDataDec ? 'CodeFromSPCKeyboard' : 'DriverId'
    };
    break;
  case 47:
    alarm = {type: 'DriverAuthentication', status: true};
    break;
  case 48:
    switch (txDataBin) {
    case '00000001':
      alarm = {type: 'DI', number: 1, status: false, mode: 'Normal'};
      break;
    case '00000010':
      alarm = {type: 'DI', number: 1, status: false, mode: 'Robbery'};
      break;
    case '00000100':
      alarm = {type: 'DI', number: 1, status: false, mode: 'CarSharing2'};
      break;
    default:
      alarm = {type: 'DI', number: 1, status: false};
    }
    break;
  case 49:
    switch (txDataBin) {
    case '00000001':
      alarm = {type: 'DI', number: 2, status: false, mode: 'Normal'};
      break;
    case '00000010':
      alarm = {type: 'DI', number: 2, status: false, mode: 'CarSharing2ModemOffEnded'};
      break;
    case '00000100':
      alarm = {type: 'DI', number: 2, status: false, mode: 'CarSharing2ModemOffStarted'};
      break;
    case '00001000':
      alarm = {type: 'DI', number: 2, status: false, mode: 'CarSharing2BussinesModeStarted'};
      break;
    case '00010000':
      alarm = {type: 'DI', number: 2, status: false, mode: 'CarSharing2PrivateModeStarted'};
      break;
    default:
      alarm = {type: 'DI', number: 2, status: false};
    }
    break;
  case 50:
    alarm = {type: 'CFE', number: 6, status: false};
    break;
  case 51:
    alarm = {type: 'Volume', status: false};
    break;
  case 52:
    alarm = {type: 'Hotwire', status: false};
    break;
  case 53:
    alarm = {type: 'Driving', status: false};
    break;
  case 54:
    alarm = {type: 'DistressButton', status: false};
    break;
  case 55:
    alarm = {type: 'DI', number: 3, status: false};
    break;
  case 56:
    alarm = {type: 'OilPressure', status: false};
    break;
  case 57:
    alarm = {type: 'CFE', number: 1, status: false};
    break;
  case 58:
    alarm = {type: 'DI', number: 4, status: false};
    break;
  case 59:
    alarm = {type: 'CFE', number: 2, status: false};
    break;
  case 60:
    alarm = {type: 'CFE', number: 3, status: false};
    break;
  case 61:
    alarm = {type: 'CFE', number: 4, status: false};
    break;
  case 62:
    alarm = {type: 'CFE', number: 5, status: false};
    break;
  case 63:
    alarm = {type: 'DI', number: 5, status: false};
    break;
  case 64:
    switch (txDataBin) {
    case '00000001':
      alarm = {type: 'DI', number: 1, status: true, mode: 'Normal'};
      break;
    case '00000010':
      alarm = {type: 'DI', number: 1, status: true, mode: 'Robbery'};
      break;
    case '00000100':
      alarm = {type: 'DI', number: 1, status: true, mode: 'CarSharing2'};
      break;
    default:
      alarm = {type: 'DI', number: 1, status: true};
    }
    break;
  case 65:
    switch (txDataBin) {
    case '00000001':
      alarm = {type: 'DI', number: 2, status: true, mode: 'Normal'};
      break;
    case '00000010':
      alarm = {type: 'DI', number: 2, status: true, mode: 'CarSharing2ModemOffEnded'};
      break;
    case '00000100':
      alarm = {type: 'DI', number: 2, status: true, mode: 'CarSharing2ModemOffStarted'};
      break;
    case '00001000':
      alarm = {type: 'DI', number: 2, status: true, mode: 'CarSharing2BussinesModeStarted'};
      break;
    case '00010000':
      alarm = {type: 'DI', number: 2, status: true, mode: 'CarSharing2PrivateModeStarted'};
      break;
    default:
      alarm = {type: 'DI', number: 2, status: true};
    }
    break;
  case 66:
    alarm = {type: 'CFE', number: 6, status: false};
    break;
  case 67:
    alarm = {type: 'Volume', status: true};
    break;
  case 68:
    alarm = {type: 'Hotwire', status: true};
    break;
  case 69:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Driving', status: true, mode: 'normal'};
      break;
    case 1:
      alarm = {type: 'Driving', status: true, mode: 'gps'};
      break;
    default:
      alarm = {type: 'Driving', status: true};
    }
    break;
  case 70:
    alarm = {type: 'DistressButton', status: true};
    break;
  case 71:
    alarm = {type: 'DI', number: 3, status: true};
    break;
  case 72:
    alarm = {type: 'OilPressure', status: true};
    break;
  case 73:
    alarm = {type: 'CFE', number: 1, status: true};
    break;
  case 74:
    alarm = {type: 'DI', number: 4, status: true};
    break;
  case 75:
    alarm = {type: 'CFE', number: 2, status: true};
    break;
  case 76:
    alarm = {type: 'CFE', number: 3, status: true};
    break;
  case 77:
    alarm = {type: 'CFE', number: 4, status: true};
    break;
  case 78:
    alarm = {type: 'CFE', number: 5, status: true};
    break;
  case 79:
    alarm = {type: 'DI', number: 5, status: true};
    break;
  case 80:
    alarm = {type: 'Power', status: false};
    break;
  case 81:
    alarm = {type: 'Low_Battery', status: true};
    break;
  case 82:
    alarm = {type: 'BackupBatteryDisconnect', status: true};
    break;
  case 83:
    alarm = {type: 'BackupBatteryLowLevel', status: true};
    break;
  case 84:
    alarm = {type: 'Moving', status: false};
    break;
  case 85:
    alarm = {type: 'Moving', status: true};
    break;
  case 87:
    alarm = {type: 'Power', status: false};
    break;
  case 88:
    alarm = {type: 'Low_Battery', status: false};
    break;
  case 89:
    alarm = {type: 'BackupBatteryDisconnect', status: false};
    break;
  case 90:
    alarm = {type: 'BackupBatteryLowLevel', status: false};
    break;
  case 91:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'KeypadUndefinedFailure'};
      break;
    case 1:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'ImmobilizerDeviceWiresDisconnection'};
      break;
    case 2:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'KeypadLocked'};
      break;
    case 3:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'RelayMalfuction'};
      break;
    case 4:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'IgnitionWireDisconnected'};
      break;
    case 5:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'StarterSignalDetection'};
      break;
    case 6:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'StarterMalfuction'};
      break;
    case 7:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'HotwiringDetection'};
      break;
    case 8:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'PrimaryCutUnitFailure'};
      break;
    case 9:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'SecundaryCutUnitFailure'};
      break;
    case 10:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'WrongKeyboardIDDetected'};
      break;
    case 11:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'PairingAccomplished'};
      break;
    case 12:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'KeypadFlashFailed'};
      break;
    case 13:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'AlarmCadenceActivadedByKeyb'};
      break;
    case 14:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'AlarmCadenceDeactivadedByKeyb'};
      break;
    case 128:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'ECALLInitiaded'};
      break;
    case 129:
      alarm = {type: 'MessageFromSPCKeyboard', mode: 'BCALLInitiaded'};
      break;
    default:
      alarm = {type: 'MessageFromSPCKeyboard'};
    }
    break;
  case 92:
    switch (txDataDec) {
    case 1:
      alarm = {type: 'SatelliteCommunication', mode: 'HealthStatusReportFailure'};
      break;
    case 2:
      alarm = {type: 'SatelliteCommunication', mode: 'HealthStatusReportRestore'};
      break;
    case 3:
      alarm = {type: 'SatelliteCommunication', mode: 'PeriodicDistress'};
      break;
    default:
      alarm = {type: 'SatelliteCommunication'};
    }
    break;
  case 99:
    alarm = {type: 'HarshBraking'};
    break;
  case 100:
    alarm = {type: 'SuddenCourseChange'};
    break;
  case 101:
    alarm = {type: 'HarshAcceleration'};
    break;
  case 102:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'ActivationModeChange', status: false};
      break;
    case 1:
      alarm = {type: 'ActivationModeChange', status: true};
      break;
    default:
      alarm = {type: 'ActivationModeChange'};
    }
    break;
  case 104:
    alarm = {type: 'TriggerGeneral'};
    break;
  case 105:
    alarm = {type: 'Arm'};
    break;
  case 106:
    alarm = {type: 'Disarm'};
    break;
  case 107:
    alarm = {type: 'RemoteController'};
    break;
  case 108:
    alarm = {type: 'OdometerPulse'};
    break;
  case 109:
    alarm = {type: 'UnlockPulse'};
    break;
  case 110:
    alarm = {type: 'LockPulse'};
    break;
  case 111:
    alarm = {type: 'Blinkers'};
    break;
  case 112:
    alarm = {type: 'ProtectedOutputFailure'};
    break;
  case 144:
    alarm = {type: 'ResetWhileArmed'};
    break;
  case 145:
    alarm = {type: 'WirelessPanicButton'};
    break;
  case 150:
    alarm = {type: 'SignalLearned'};
    break;
  case 151:
    alarm = {type: 'LearningFailed'};
    break;
  case 152:
    alarm = {type: 'ReceivedSignalA'};
    break;
  case 153:
    alarm = {type: 'ReceivedSignalB'};
    break;
  case 154:
    alarm = {type: 'Hibernate'};
    break;
  case 158:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Tamper', status: true, mode: 'RemovalFromCradle'};
      break;
    case 2:
      alarm = {type: 'Tamper', status: true, mode: 'TiltTamper'};
      break;
    case 3:
      alarm = {type: 'Tamper', status: true, mode: 'EnclosureOpened'};
      break;
    default:
      alarm = {type: 'Tamper'};
    }
    break;
  case 159:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'Tamper', status: false, mode: 'BackToCradle'};
      break;
    case 2:
      alarm = {type: 'Tamper', status: false, mode: 'Spare'};
      break;
    case 3:
      alarm = {type: 'Tamper', status: false, mode: 'EnclosureClosed'};
      break;
    default:
      alarm = {type: 'Tamper'};
    }
    break;
  case 160:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'CFE_Event', mode: 'Disconnected'};
      break;
    case 1:
      alarm = {type: 'CFE_Event', mode: 'Connected'};
      break;
    case 2:
      alarm = {type: 'CFE_Event', mode: 'ReprogrammingSucceded'};
      break;
    case 3:
      alarm = {type: 'CFE_Event', mode: 'ReprogrammingFailed'};
      break;
    default:
      alarm = {type: 'CFE_Event'};
    }
    break;
  case 161:
    alarm = {type: 'Unlock'};
    break;
  case 162:
    alarm = {type: 'ModeconGasLeak', status: true};
    break;
  case 163:
    alarm = {type: 'ModeconGasLeak', status: false};
    break;
  case 164:
    switch (txDataDec) {
    case 1:
      alarm = {type: 'Nano_Event', mode: 'Impact'};
      break;
    case 2:
      alarm = {type: 'Nano_Event', mode: 'OrientationChange'};
      break;
    case 3:
      alarm = {type: 'Nano_Event', mode: 'ManDown'};
      break;
    case 4:
      alarm = {type: 'Nano_Event', mode: 'OpenPackage'};
      break;
    case 5:
      alarm = {type: 'Nano_Event', mode: 'ClosePackage'};
      break;
    case 6:
      alarm = {type: 'Nano_Event', mode: 'TotalMagneticFieldOutOfRange'};
      break;
    case 7:
      alarm = {type: 'Nano_Event', mode: 'TotalMagneticFieldBackInRange'};
      break;
    case 9:
      alarm = {type: 'Nano_Event', mode: 'WorkIDPromoted'};
      break;
    case 10:
      alarm = {type: 'Nano_Event', mode: 'MultiSense'};
      break;
    case 11:
      alarm = {type: 'Nano_Event', mode: 'Temperature'};
      break;
    case 12:
      alarm = {type: 'Nano_Event', mode: 'Humidity'};
      break;
    case 13:
      alarm = {type: 'Nano_Event', mode: 'CheckIn'};
      break;
    case 14:
      alarm = {type: 'Nano_Event', mode: 'OpenDoor/Window'};
      break;
    case 15:
      alarm = {type: 'Nano_Event', mode: 'CloseDoor/Window'};
      break;
    case 16:
      alarm = {type: 'Nano_Event', mode: 'FreeFall'};
      break;
    default:
      alarm = {type: 'Nano_Event'};
    }
    break;
  case 165:
    alarm = {type: 'NanoLocationReportPOD'};
    break;
  case 167:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'CANGPSSpeedCalibration', mode: 'Start'};
      break;
    case 1:
      alarm = {type: 'CANGPSSpeedCalibration', mode: 'Accomplished'};
      break;
    case 2:
      alarm = {type: 'CANGPSSpeedCalibration', mode: 'Failed'};
      break;
    case 3:
      alarm = {type: 'CANGPSSpeedCalibration', mode: 'Unknown'};
      break;
    default:
      alarm = {type: 'CANGPSSpeedCalibration'};
    }
    break;
  case 170:
    switch (txDataDec) {
    case 1:
      alarm = {type: 'SMSDelivery', mode: 'Delivered'};
      break;
    case 2:
      alarm = {type: 'SMSDelivery', mode: 'SMSCDelivered'};
      break;
    case 3:
      alarm = {type: 'SMSDelivery', mode: 'Failed'};
      break;
    case 4:
      alarm = {type: 'SMSDelivery', mode: 'NoResponse'};
      break;
    case 5:
      alarm = {type: 'SMSDelivery', mode: 'Rejected'};
      break;
    default:
      alarm = {type: 'SMSDelivery'};
    }
    break;
  case 190:
    alarm = {type: 'NoModemZone'};
    break;
  case 191:
    alarm = {
      type: 'GeoHotSpotViolation',
      index: txDataBin.substr(1).split('').reverse().join('').indexOf(1),
      direction: txDataBin[0] === '1' ? 'entry' : 'exit'
    };
    break;
  case 192:
    switch (txDataBin[2]) {
    case '0':
      alarm = {
        type: 'FrequencyMeasurementThresholdViolation',
        number: txDataBin[0],
        status: txDataBin[1] === '0',
        vtype: txDataBin[2] === '0' ? 'threshold' : 'range',
        direction: txDataBin[3] === '0' ? 'LowThresh' : 'HighThresh'
      };
      break;
    case '1':
      alarm = {
        type: 'FrequencyMeasurementThresholdViolation',
        number: txDataBin[0],
        status: txDataBin[1] === '0',
        vtype: txDataBin[2] === '0' ? 'threshold' : 'range',
        direction: txDataBin[3] === '0' ? 'KeepIn' : 'KeepOut'
      };
      break;
    default:
      alarm = {
        type: 'FrequencyMeasurementThresholdViolation',
        number: txDataBin[0],
        status: txDataBin[1] === '0',
        vtype: txDataBin[2] === '0' ? 'threshold' : 'range'
      };
    }
    break;
  case 193:
    alarm = {type: 'CELL_ID'};
    break;
  case 194:
    alarm = {
      type: 'AnalogMeasurementThresholdViolation',
      number: txDataBin[0],
      status: txDataBin[1] === '0',
      vtype: txDataBin[2] === '0' ? 'threshold' : 'range',
      direction: txDataBin[3] === '1' ? 'LowThresh' : 'HighThresh'
    };
    break;
  case 195:
    alarm = {type: 'CFE_INPUTS_REPORTS'};
    break;
  case 196:
    alarm = {type: 'ONEWIRE_TEMPERATURE'};
    break;
  case 197:
    alarm = {type: 'EOF_TRIP_TYPE'};
    break;
  case 199:
    alarm = {type: 'TrailerConnection', status: txDataDec === 1};
    break;
  case 200:
    alarm = {
      type: 'AHR',
      reason: core.convertBase(txDataBin.substr(0, 4), 2, 10) === 1 ? 'RegistrationProblem' : 'ModemNonResponsiveness',
      number: core.convertBase(txDataBin.substr(4), 2, 10)
    };
    break;
  case 201:
    alarm = {type: 'PSP'};
    break;
  case 202:
    alarm = {type: 'WakeUp'};
    break;
  case 203:
    alarm = {type: 'PreHibernation'};
    break;
  case 204:
    alarm = {type: 'VectorChange'};
    break;
  case 205:
    alarm = {type: 'GarminConnection', status: txDataDec === 1};
    break;
  case 206:
    switch (core.convertBase(txDataBin.substr(5, 2), 2, 10)) {
    case 0:
      alarm = {type: 'Jamming', status: txDataBin[7] === '0', ignition: 'legacy'};
      break;
    case 1:
      alarm = {type: 'Jamming', status: txDataBin[7] === '0', ignition: 'off'};
      break;
    case 2:
      alarm = {type: 'Jamming', status: txDataBin[7] === '0', ignition: 'on'};
      break;
    default:
      alarm = {type: 'Jamming', status: txDataBin[7] === '0'};
    }
    break;
  case 207:
    alarm = {
      type: 'RadioOffMode',
      early: txDataBin[5] === '1',
      gps: txDataBin[6] === '1',
      modem: txDataBin[7] === '1',
    };
    break;
  case 208:
    alarm = {type: 'HeaderError'};
    break;
  case 209:
    alarm = {type: 'ScriptVersionError'};
    break;
  case 210:
    alarm = {type: 'UnsupportedCommand'};
    break;
  case 211:
    alarm = {type: 'BadParameters'};
    break;
  case 212:
    alarm = {type: 'OverSpeedGeoFence', status: true, index: txDataDec};
    break;
  case 213:
    alarm = {type: 'OverSpeedGeoFence', status: false, index: txDataDec};
    break;
  case 214:
    alarm = {type: 'PULSE_COUNTER'};
    break;
  case 221:
    alarm = {type: 'ERROR_EVENT'};
    break;
  case 222:
    alarm = {type: 'PHSN', status: txDataDec === 1};
    break;
  case 223:
    alarm = {type: 'CPINError', event: txDataDec};
    break;
  case 232:
    alarm = {type: 'ExternalNVMError'};
    break;
  case 239:
    alarm = {type: 'MaxError'};
    break;
  case 245:
    alarm = {type: 'UploadMode'};
    break;
  case 246:
    alarm = {type: 'ExecuteMode'};
    break;
  case 247:
    alarm = {type: 'FinishMode'};
    break;
  case 248:
    alarm = {type: 'PostBootMode'};
    break;
  case 252:
    switch (txDataDec) {
    case 0:
      alarm = {type: 'COMLocationGlancing', mode: 'Plaint'};
      break;
    case 1:
      alarm = {type: 'COMLocationGlancing', mode: 'ST'};
      break;
    case 2:
      alarm = {type: 'COMLocationGlancing', mode: 'Nano'};
      break;
    default:
      alarm = {type: 'COMLocationGlancing'};
    }
    break;
  case 253:
    alarm = {type: 'Geofence', status: 'in', index: txDataDec};
    break;
  case 254:
    alarm = {type: 'Geofence', status: 'out', index: txDataDec};
    break;
  case 255:
    alarm = {type: 'WayPoint', index: txDataDec};
    break;
  default:
    alarm = {
      type: 'UNKNOWN',
      transmission: {
        reason: transmissionReason,
        specific: transmissionReasonSpecificData
      }
    };
  }
  return alarm;
};
