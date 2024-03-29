
const aeolusSimulationInput = {
  name: "Aeolus",
  version: 1.0,
  dependencies: {
    baseSrc: "./samples/aeolus/",
    modelSrc: "DSAC_Static_Mod_Scripted.xml",
    targetSrc: "v2.2-300targets.xml",
    pythonSrc: "pythonScripts/",
    outputPath: "none"
  },
  simulationParameters: {
    startJD: 2454680.0,
    startSeconds: 0.0,
    endSeconds: 90.0,
    stepSeconds: 30
  },
  schedulerParameters: {
    maxSchedules: 10,
    cropTo: 5
  }
}
const initSimulationInput = {
  name: '',
  version: 1.0,
  dependencies: {
    baseSrc: '',
    modelSrc: '',
    targetSrc: '',
    pythonSrc: '',
    outputPath: ''
  },
  simulationParameters: {
    startJD: 2454680.0,
    startSeconds: 0.0,
    endSeconds: 90.0,
    stepSeconds: 30
  },
  schedulerParameters: {
    maxSchedules: 10,
    cropTo: 5
  }
}

export { aeolusSimulationInput, initSimulationInput };