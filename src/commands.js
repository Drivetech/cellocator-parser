'use strict';

module.exports = {
  status: {
    codeField: '00', dataField: '00'
  },
  goToStandby: {
    codeField: '02', dataField: '00'
  },
  goToEmergencyMode: {
    codeField: '02', dataField: '01'
  },
  reset: {
    codeField: '02', dataField: '02'
  },
  enterGarangeMode: {
    codeField: '02', dataField: '03'
  },
  armAlarm: {
    codeField: '02', dataField: '04'
  },
  releaseFromEmergencyMode: {
    codeField: '02', dataField: '05'
  },
  deactivateSiren: {
    codeField: '03', dataField: '00'
  },
  activateSiren: {
    codeField: '03', dataField: '10'
  },
  deactivateHoodLock: {
    codeField: '03', dataField: '01'
  },
  activateHoodLock: {
    codeField: '03', dataField: '11'
  },
  deactivateSP1W: {
    codeField: '03', dataField: '02'
  },
  activateSP1W: {
    codeField: '03', dataField: '12'
  },
  deactivateExtImmobilizer: {
    codeField: '03', dataField: '03'
  },
  activateExtImmobilizer: {
    codeField: '03', dataField: '13'
  },
  deactivateBlinkers: {
    codeField: '03', dataField: '04'
  },
  activateBlinkers: {
    codeField: '03', dataField: '14'
  },
  deactivateImmobilizer: {
    codeField: '03', dataField: '05'
  },
  activateImmobilizer: {
    codeField: '03', dataField: '15'
  },
  deactivateSpeakerPhoneVoltage: {
    codeField: '03', dataField: '06'
  },
  activateSpeakerPhoneVoltage: {
    codeField: '03', dataField: '16'
  },
  deactivateInternalLights: {
    codeField: '03', dataField: '07'
  },
  activateInternalLights: {
    codeField: '03', dataField: '17'
  },
  deactivateLED: {
    codeField: '03', dataField: '08'
  },
  activateLED: {
    codeField: '03', dataField: '18'
  },
  deactivateGeneralOutput: {
    codeField: '03', dataField: '09'
  },
  activateGeneralOutput: {
    codeField: '03', dataField: '19'
  },
  deactivateWindows: {
    codeField: '03', dataField: '0A'
  },
  activateWindows: {
    codeField: '03', dataField: '1A'
  },
  deactivateStopLight: {
    codeField: '03', dataField: '0B'
  },
  activateStopLight: {
    codeField: '03', dataField: '1B'
  },
  deactivateBuzzer: {
    codeField: '03', dataField: '0C'
  },
  activateBuzzer: {
    codeField: '03', dataField: '1C'
  },
  lock: {
    codeField: '03', dataField: '0E'
  },
  unlock: {
    codeField: '03', dataField: '0F'
  },
  disableActiveTransmissions: {
    codeField: '04', dataField: '00'
  },
  enableActiveTransmissions: {
    codeField: '04', dataField: '01'
  },
  trackingControl: {
    codeField: '05', dataField: '00'
  },
  deactiveAlarmCadenceControl: {
    codeField: '06', dataField: '00'
  },
  activeAlarmCadenceControl: {
    codeField: '06', dataField: '01'
  },
  dontCareAlarmCadenceControl: {
    codeField: '06', dataField: '02'
  },
  activateEngineStop: {
    codeField: '07', dataField: '00'
  },
  deactivateEngineStop: {
    codeField: '07', dataField: '01'
  },
  initiateCSDSession: {
    codeField: '0C', dataField: '00'
  },
  eraseLogMemory: {
    codeField: '0D', dataField: '00'
  },
  resetGPS: {
    codeField: '0E', dataField: '00'
  },
  resetGPS1st: {
    codeField: '0E', dataField: '5A'
  },
  resetGPS2nd: {
    codeField: '0E', dataField: 'A5'
  },
  learnLockSequence: {
    codeField: '0F', dataField: '00'
  },
  learnUnlockSequence: {
    codeField: '0F', dataField: '01'
  },
  learnAdditionalUnlockSequence: {
    codeField: '0F', dataField: '02'
  },
  eraseLearnedSequences: {
    codeField: '0F', dataField: 'FF'
  },
  automaticGPSBehavior: {
    codeField: '10', dataField: '00'
  },
  forceEnergizingGPS: {
    codeField: '10', dataField: '01'
  },
  connectToMainServer: {
    codeField: '12', dataField: '00'
  },
  connectToSecondaryServer: {
    codeField: '12', dataField: '01'
  },
  connectToMaintenanceServer: {
    codeField: '12', dataField: '02'
  },
  transparentModeStop: {
    codeField: '15', dataField: '00'
  },
  transparentModeStart: {
    codeField: '15', dataField: '01'
  }
};
