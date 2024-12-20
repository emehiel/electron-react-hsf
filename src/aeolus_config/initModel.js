const pythonSrc = window.electronApi
  ? window.electronApi.pythonSrc
  : "../../Horizon/samples/Aeolus/pythonScripts";

const initModel = {
  assets: [
    {
      name: "Asset1",
      dynamicState: {
        type: "Predetermined_ECI",
        stateData: [7378.137, 0, 0, 0, 6.02088, 4.215866],
        Eoms: {
          type: "orbitalEOMS",
        },
        integratorOptions: {
          h: ".15",
          rtol: 0.0015,
          atol: 0.000015,
          eps: 5e-324,
          nSteps: 1005,
        },
        integratorParameters: [
          {
            type: "double",
            key: "gyro",
            value: 5.3,
          },
          {
            type: "vector",
            key: "accel",
            value: [1, 2, 3],
          },
        ],
      },
      subsystems: [
        {
          type: "scripted",
          name: "ADCS",
          src: pythonSrc + "/adcs.py",
          className: "adcs",
          states: [
            {
              type: "Matrix",
              name: "pointvec_key",
              key: "ECI_Pointing_Vector(XYZ)",
              value: [0, 0, 0],
            },
          ],
        },
        {
          type: "scripted",
          name: "EOSensor",
          src: pythonSrc + "/eosensor.py",
          className: "eosensor",
          parameters: [
            {
              name: "lowQualityCaptureTime",
              type: "double",
              value: 3,
            },
            {
              name: "midQualityCaptureTime",
              type: "double",
              value: 5,
            },
            {
              name: "highQualityCaptureTime",
              type: "double",
              value: 7,
            },
            {
              name: "lowQualityNumPixels",
              type: "double",
              value: 5000,
            },
            {
              name: "midQualityNumPixels",
              type: "double",
              value: 10000,
            },
            {
              name: "highQualityNumPixels",
              type: "double",
              value: 15000,
            },
          ],
          states: [
            {
              type: "double",
              name: "pixels_key",
              key: "numPixels",
              value: 0,
            },
            {
              type: "double",
              name: "incidence_key",
              key: "incidenceAngle",
              value: 0,
            },
            {
              type: "bool",
              name: "eoon_key",
              key: "EOSensorOn",
              value: false,
            },
          ],
        },
        {
          type: "scripted",
          name: "SSDR",
          src: pythonSrc + "/ssdr.py",
          className: "ssdr",
          parameters: [
            {
              name: "bufferSize",
              type: "double",
              value: 5000,
            },
          ],
          states: [
            {
              type: "double",
              name: "dataBufferFillRatio_key",
              key: "DataBufferFillRatio",
              value: 0,
            },
          ],
        },
        {
          type: "scripted",
          name: "Comm",
          src: pythonSrc + "/comm.py",
          className: "comm",
          states: [
            {
              type: "double",
              name: "datarate_key",
              key: "DataRate(MB/s)",
              value: 0,
            },
          ],
        },
        {
          type: "scripted",
          name: "Power",
          src: pythonSrc + "/power.py",
          className: "power",
          parameters: [
            {
              name: "batterySize",
              type: "double",
              value: 1000000,
            },
            {
              name: "fullSolarPower",
              type: "double",
              value: 150,
            },
            {
              name: "penumbraSolarPower",
              type: "double",
              value: 75,
            },
          ],
          states: [
            {
              type: "double",
              name: "dod_key",
              key: "DepthOfDischarge",
              value: 0,
            },
            {
              type: "double",
              name: "powin_key",
              key: "SolarPanelPowerIn",
              value: 0,
            },
          ],
        },
      ],
      constraints: [
        {
          value: 0.25,
          subsystemName: "Power",
          type: "FAIL_IF_HIGHER",
          name: "con1",
          state: {
            type: "double",
            key: "DepthOfDischarge",
          },
        },
        {
          value: 0.7,
          subsystemName: "SSDR",
          type: "FAIL_IF_HIGHER",
          name: "con2",
          state: {
            type: "double",
            key: "DataBufferFillRatio",
          },
        },
      ],
    },
    {
      name: "Asset2",
      dynamicState: {
        type: "Predetermined_ECI",
        stateData: [-7378.137, 0, 0, 0, -6.02088, 4.215866],
        Eoms: {
          type: "orbitalEOMS",
        },
      },
      subsystems: [
        {
          type: "scripted",
          name: "ADCS",
          src: pythonSrc + "/adcs.py",
          className: "adcs",
          states: [
            {
              type: "Matrix",
              name: "POINTVEC_KEY",
              key: "ECI_Pointing_Vector(XYZ)",
              value: [0, 0, 0],
            },
          ],
        },
        {
          type: "scripted",
          name: "EOSensor",
          src: pythonSrc + "/eosensor.py",
          className: "eosensor",
          parameters: [
            {
              name: "lowQualityCaptureTime",
              type: "double",
              value: 3,
            },
            {
              name: "midQualityCaptureTime",
              type: "double",
              value: 5,
            },
            {
              name: "highQualityCaptureTime",
              type: "double",
              value: 7,
            },
            {
              name: "lowQualityNumPixels",
              type: "double",
              value: 5000,
            },
            {
              name: "midQualityNumPixels",
              type: "double",
              value: 10000,
            },
            {
              name: "highQualityNumPixels",
              type: "double",
              value: 15000,
            },
          ],
          states: [
            {
              type: "double",
              name: "PIXELS_KEY",
              key: "numPixels",
              value: 0,
            },
            {
              type: "double",
              name: "INCIDENCE_KEY",
              key: "incidenceAngle",
              value: 0,
            },
            {
              type: "bool",
              name: "EOON_KEY",
              key: "EOSensorOn",
              value: false,
            },
          ],
        },
        {
          type: "scripted",
          name: "SSDR",
          src: pythonSrc + "/ssdr.py",
          className: "ssdr",
          parameters: [
            {
              name: "bufferSize",
              type: "double",
              value: 5000,
            },
          ],
          states: [
            {
              type: "double",
              name: "dataBufferFillRatio_key",
              key: "DataBufferFillRatio",
              value: 0,
            },
          ],
        },
        {
          type: "scripted",
          name: "Comm",
          src: pythonSrc + "/comm.py",
          className: "comm",
          states: [
            {
              type: "double",
              name: "DATARATE_KEY",
              key: "DataRate(MB/s)",
              value: 0,
            },
          ],
        },
        {
          type: "scripted",
          name: "Power",
          src: pythonSrc + "/power.py",
          className: "power",
          parameters: [
            {
              name: "batterySize",
              type: "double",
              value: 1000000,
            },
            {
              name: "fullSolarPower",
              type: "double",
              value: 150,
            },
            {
              name: "penumbraSolarPower",
              type: "double",
              value: 75,
            },
          ],
          states: [
            {
              type: "double",
              name: "dod_key",
              key: "DepthOfDischarge",
              value: 0,
            },
            {
              type: "double",
              name: "POWIN_KEY",
              key: "SolarPanelPowerIn",
              value: 0,
            },
          ],
        },
      ],
      constraints: [
        {
          value: 0.25,
          subsystemName: "Power",
          type: "FAIL_IF_HIGHER",
          name: "con1",
          state: {
            type: "double",
            key: "DepthOfDischarge",
          },
        },
        {
          value: 0.7,
          subsystemName: "SSDR",
          type: "FAIL_IF_HIGHER",
          name: "con2",
          state: {
            type: "double",
            key: "DataBufferFillRatio",
          },
        },
      ],
    },
  ],
  dependencies: [
    {
      subsystemName: "EOSensor",
      assetName: "Asset1",
      depSubsystemName: "ADCS",
      depAssetName: "Asset1",
    },
    {
      subsystemName: "SSDR",
      assetName: "Asset1",
      depSubsystemName: "EOSensor",
      depAssetName: "Asset1",
      fcnName: "SSDR_asset1_from_EOSensor_asset1",
    },
    {
      subsystemName: "Comm",
      assetName: "Asset1",
      depSubsystemName: "SSDR",
      depAssetName: "Asset1",
      fcnName: "Comm_asset1_from_SSDR_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset1",
      depSubsystemName: "Comm",
      depAssetName: "Asset1",
      fcnName: "Power_asset1_from_Comm_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset1",
      depSubsystemName: "ADCS",
      depAssetName: "Asset1",
      fcnName: "Power_asset1_from_ADCS_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset1",
      depSubsystemName: "EOSensor",
      depAssetName: "Asset1",
      fcnName: "Power_asset1_from_EOSensor_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset1",
      depSubsystemName: "SSDR",
      depAssetName: "Asset1",
      fcnName: "Power_asset1_from_SSDR_asset1",
    },
    {
      subsystemName: "EOSensor",
      assetName: "Asset2",
      depSubsystemName: "ADCS",
      depAssetName: "Asset2",
    },
    {
      subsystemName: "SSDR",
      assetName: "Asset2",
      depSubsystemName: "EOSensor",
      depAssetName: "Asset2",
      fcnName: "SSDR_asset1_from_EOSensor_asset1",
    },
    {
      subsystemName: "Comm",
      assetName: "Asset2",
      depSubsystemName: "SSDR",
      depAssetName: "Asset2",
      fcnName: "Comm_asset1_from_SSDR_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset2",
      depSubsystemName: "Comm",
      depAssetName: "Asset2",
      fcnName: "Power_asset1_from_Comm_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset2",
      depSubsystemName: "ADCS",
      depAssetName: "Asset2",
      fcnName: "Power_asset1_from_ADCS_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset2",
      depSubsystemName: "EOSensor",
      depAssetName: "Asset2",
      fcnName: "Power_asset1_from_EOSensor_asset1",
    },
    {
      subsystemName: "Power",
      assetName: "Asset2",
      depSubsystemName: "SSDR",
      depAssetName: "Asset2",
      fcnName: "Power_asset1_from_SSDR_asset1",
    },
  ],
  evaluator: {
    type: "TargetValueEvaluator",
    src: pythonSrc + "/evaluator.py",
    className: "EVAL",
    keyRequests: [
      {
        asset: "Asset1",
        subsystem: "SSDR",
        type: "double",
      },
      {
        asset: "Asset2",
        subsystem: "SSDR",
        type: "double",
      },
      {
        asset: "Asset2",
        subsystem: "EOSensor",
        type: "double",
      },
      {
        asset: "Asset1",
        subsystem: "ADCS",
        type: "double",
      },
    ],
  },
};

export default initModel;
