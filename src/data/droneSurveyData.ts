// GeoRecon AI - High-Precision Drone Photogrammetry & UAV Survey Engine
// Standards: Survey of India SVAMITVA UAV Guidelines & DGCA SOP for Urban Cadastral Drone Mapping

export interface DroneCameraStation {
  id: string;
  coords: [number, number];
  photoName: string;
  pitch: number;
  roll: number;
  heading: number;
  altitudeM: number;
  gsdCm: number;
  rtkFix: 'Fixed' | 'Float';
  shutterSpeed: string;
  timestamp: string;
}

export interface DroneGCP {
  id: string;
  name: string;
  coords: [number, number];
  elevationM: number;
  surveyMethod: string;
  residualErrorM: number;
  status: 'Verified' | 'Calibrated';
}

export interface DroneMission {
  id: string;
  name: string;
  sectorName: string;
  wardId: string;
  flightDate: string;
  droneModel: string;
  payloadCamera: string;
  pilotName: string;
  dgcaUin: string;
  flightAltitudeM: number;
  gsdCm: number;
  forwardOverlap: number;
  sideOverlap: number;
  photoCount: number;
  flightDurationMin: number;
  coverageAreaHa: number;
  sfmReprojectionErrorPx: number;
  bundleAdjustmentRmsM: number;
  takeoffPoint: [number, number];
  flightPath: [number, number][];
  cameraStations: DroneCameraStation[];
  gcps: DroneGCP[];
  orthoBounds: [[number, number], [number, number]];
}

// Mission 1: Indiranagar / Domlur Urban Cadastral UAV Survey (Ward 112)
export const INDIRANAGAR_DRONE_MISSION: DroneMission = {
  id: 'UAV-BLR-2026-03',
  name: 'Indiranagar Urban Cadastre 5cm Orthomosaic',
  sectorName: 'Indiranagar & Domlur Commercial Corridor',
  wardId: 'Ward 112 (BBMP East Zone)',
  flightDate: '2026-03-14 07:45 IST',
  droneModel: 'DJI Matrice 300 RTK + D-RTK 2 Base Station',
  payloadCamera: 'Zenmuse P1 (45MP Full-Frame Photogrammetry Sensor, 35mm Lens)',
  pilotName: 'Capt. R. Deshmukh (DGCA Certified RPC-7821)',
  dgcaUin: 'UIN-2026-KA-9941',
  flightAltitudeM: 120.0,
  gsdCm: 4.8,
  forwardOverlap: 80,
  sideOverlap: 75,
  photoCount: 384,
  flightDurationMin: 28,
  coverageAreaHa: 18.5,
  sfmReprojectionErrorPx: 0.34,
  bundleAdjustmentRmsM: 0.018,
  takeoffPoint: [12.9710, 77.6405],
  orthoBounds: [
    [12.9712, 77.6405],
    [12.9768, 77.6462]
  ],
  flightPath: [
    [12.9710, 77.6405], // Takeoff
    [12.9715, 77.6408], // Line 1 start
    [12.9715, 77.6458], // Line 1 end
    [12.9727, 77.6458], // Turn 1
    [12.9727, 77.6408], // Line 2
    [12.9739, 77.6408], // Turn 2
    [12.9739, 77.6458], // Line 3
    [12.9751, 77.6458], // Turn 3
    [12.9751, 77.6408], // Line 4
    [12.9763, 77.6408], // Turn 4
    [12.9763, 77.6458], // Line 5 end
    [12.9710, 77.6405]  // RTH Landing
  ],
  gcps: [
    {
      id: 'GCP-UAV-01',
      name: 'SW Sector Survey Benchmark',
      coords: [12.9714, 77.6410],
      elevationM: 918.42,
      surveyMethod: 'Survey of India CORS RTK (20 min static)',
      residualErrorM: 0.011,
      status: 'Verified'
    },
    {
      id: 'GCP-UAV-02',
      name: 'SE Commercial Corner Benchmark',
      coords: [12.9714, 77.6455],
      elevationM: 917.85,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.014,
      status: 'Verified'
    },
    {
      id: 'GCP-UAV-03',
      name: 'Sector Center Primary Datum',
      coords: [12.9738, 77.6432],
      elevationM: 919.10,
      surveyMethod: 'Trimble R12 GNSS Base Tie',
      residualErrorM: 0.009,
      status: 'Verified'
    },
    {
      id: 'GCP-UAV-04',
      name: '100 Feet Road Widening Peg',
      coords: [12.9740, 77.6410],
      elevationM: 918.90,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.012,
      status: 'Verified'
    },
    {
      id: 'GCP-UAV-05',
      name: 'Raja Kaluve Stormwater Culvert Datum',
      coords: [12.9762, 77.6456],
      elevationM: 916.70,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.015,
      status: 'Verified'
    },
    {
      id: 'GCP-UAV-06',
      name: 'NW Boundary Cadastral Stone Tie',
      coords: [12.9762, 77.6409],
      elevationM: 920.05,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.013,
      status: 'Verified'
    }
  ],
  cameraStations: [
    { id: 'CAM-01', coords: [12.9715, 77.6412], photoName: 'BLR_P1_0081.RAW', pitch: -89.8, roll: 0.2, heading: 90.0, altitudeM: 120.2, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:46:12' },
    { id: 'CAM-02', coords: [12.9715, 77.6424], photoName: 'BLR_P1_0082.RAW', pitch: -89.9, roll: 0.1, heading: 90.1, altitudeM: 120.1, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:46:25' },
    { id: 'CAM-03', coords: [12.9715, 77.6436], photoName: 'BLR_P1_0083.RAW', pitch: -89.7, roll: -0.1, heading: 89.9, altitudeM: 120.0, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:46:38' },
    { id: 'CAM-04', coords: [12.9715, 77.6448], photoName: 'BLR_P1_0084.RAW', pitch: -90.0, roll: 0.0, heading: 90.2, altitudeM: 119.9, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:46:51' },
    { id: 'CAM-05', coords: [12.9727, 77.6448], photoName: 'BLR_P1_0102.RAW', pitch: -89.8, roll: 0.3, heading: 270.0, altitudeM: 120.3, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:48:02' },
    { id: 'CAM-06', coords: [12.9727, 77.6436], photoName: 'BLR_P1_0103.RAW', pitch: -89.9, roll: 0.2, heading: 269.8, altitudeM: 120.1, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:48:15' },
    { id: 'CAM-07', coords: [12.9727, 77.6424], photoName: 'BLR_P1_0104.RAW', pitch: -89.7, roll: -0.2, heading: 270.1, altitudeM: 120.0, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:48:28' },
    { id: 'CAM-08', coords: [12.9727, 77.6412], photoName: 'BLR_P1_0105.RAW', pitch: -90.0, roll: 0.1, heading: 270.3, altitudeM: 119.8, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:48:41' },
    { id: 'CAM-09', coords: [12.9739, 77.6412], photoName: 'BLR_P1_0142.RAW', pitch: -89.8, roll: 0.1, heading: 90.0, altitudeM: 120.2, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:50:11' },
    { id: 'CAM-10', coords: [12.9739, 77.6424], photoName: 'BLR_P1_0143.RAW', pitch: -89.9, roll: 0.2, heading: 90.2, altitudeM: 120.1, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:50:24' },
    { id: 'CAM-11', coords: [12.9739, 77.6436], photoName: 'BLR_P1_0144.RAW', pitch: -89.8, roll: -0.1, heading: 89.8, altitudeM: 120.4, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:50:37' },
    { id: 'CAM-12', coords: [12.9739, 77.6448], photoName: 'BLR_P1_0145.RAW', pitch: -90.0, roll: 0.0, heading: 90.1, altitudeM: 120.0, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:50:50' },
    { id: 'CAM-13', coords: [12.9751, 77.6448], photoName: 'BLR_P1_0182.RAW', pitch: -89.9, roll: 0.2, heading: 270.0, altitudeM: 120.1, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:52:19' },
    { id: 'CAM-14', coords: [12.9751, 77.6436], photoName: 'BLR_P1_0183.RAW', pitch: -89.7, roll: 0.1, heading: 269.9, altitudeM: 120.3, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:52:32' },
    { id: 'CAM-15', coords: [12.9751, 77.6424], photoName: 'BLR_P1_0184.RAW', pitch: -90.0, roll: -0.1, heading: 270.2, altitudeM: 120.0, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:52:45' },
    { id: 'CAM-16', coords: [12.9751, 77.6412], photoName: 'BLR_P1_0185.RAW', pitch: -89.8, roll: 0.0, heading: 270.1, altitudeM: 119.9, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:52:58' },
    { id: 'CAM-17', coords: [12.9763, 77.6412], photoName: 'BLR_P1_0210.RAW', pitch: -89.9, roll: 0.2, heading: 90.0, altitudeM: 120.2, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:54:15' },
    { id: 'CAM-18', coords: [12.9763, 77.6424], photoName: 'BLR_P1_0211.RAW', pitch: -89.8, roll: 0.1, heading: 90.2, altitudeM: 120.0, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:54:28' },
    { id: 'CAM-19', coords: [12.9763, 77.6436], photoName: 'BLR_P1_0212.RAW', pitch: -90.0, roll: -0.2, heading: 89.9, altitudeM: 120.1, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:54:41' },
    { id: 'CAM-20', coords: [12.9763, 77.6448], photoName: 'BLR_P1_0213.RAW', pitch: -89.7, roll: 0.0, heading: 90.1, altitudeM: 120.3, gsdCm: 4.8, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '07:54:54' }
  ]
};

// Mission 2: Ulsoor Lake Buffer & Catchment Wetland UAV Mission
export const ULSOOR_DRONE_MISSION: DroneMission = {
  id: 'UAV-ULSOOR-2026-02',
  name: 'Ulsoor Lake 75m Eco-Buffer UAV Orthomosaic',
  sectorName: 'Halasuru / Ulsoor Lake Wetland Corridor',
  wardId: 'Ward 90 (Halasuru)',
  flightDate: '2026-03-16 08:15 IST',
  droneModel: 'DJI Matrice 300 RTK + Zenmuse P1',
  payloadCamera: 'Zenmuse P1 (45MP Full Frame, 35mm Lens)',
  pilotName: 'A. K. Sharma (KDAM Mission Pilot)',
  dgcaUin: 'UIN-2026-KA-9942',
  flightAltitudeM: 110.0,
  gsdCm: 4.2,
  forwardOverlap: 80,
  sideOverlap: 75,
  photoCount: 290,
  flightDurationMin: 24,
  coverageAreaHa: 14.2,
  sfmReprojectionErrorPx: 0.31,
  bundleAdjustmentRmsM: 0.016,
  takeoffPoint: [12.9810, 77.6235],
  orthoBounds: [
    [12.9805, 77.6230],
    [12.9840, 77.6275]
  ],
  flightPath: [
    [12.9810, 77.6235],
    [12.9815, 77.6238],
    [12.9815, 77.6268],
    [12.9828, 77.6268],
    [12.9828, 77.6238],
    [12.9838, 77.6238],
    [12.9838, 77.6268],
    [12.9810, 77.6235]
  ],
  gcps: [
    {
      id: 'GCP-ULS-01',
      name: 'Ulsoor Boat Club Slipway Datum',
      coords: [12.9814, 77.6242],
      elevationM: 908.15,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.012,
      status: 'Verified'
    },
    {
      id: 'GCP-ULS-02',
      name: 'Kensington Road Drainage Outfall',
      coords: [12.9835, 77.6262],
      elevationM: 907.80,
      surveyMethod: 'Survey of India CORS RTK',
      residualErrorM: 0.015,
      status: 'Verified'
    }
  ],
  cameraStations: [
    { id: 'CAM-U01', coords: [12.9815, 77.6242], photoName: 'ULS_P1_0045.RAW', pitch: -89.8, roll: 0.1, heading: 90.0, altitudeM: 110.1, gsdCm: 4.2, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '08:16:10' },
    { id: 'CAM-U02', coords: [12.9815, 77.6255], photoName: 'ULS_P1_0046.RAW', pitch: -89.9, roll: 0.0, heading: 90.1, altitudeM: 110.0, gsdCm: 4.2, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '08:16:22' },
    { id: 'CAM-U03', coords: [12.9828, 77.6255], photoName: 'ULS_P1_0072.RAW', pitch: -89.8, roll: 0.2, heading: 270.0, altitudeM: 110.3, gsdCm: 4.2, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '08:17:45' },
    { id: 'CAM-U04', coords: [12.9828, 77.6242], photoName: 'ULS_P1_0073.RAW', pitch: -90.0, roll: -0.1, heading: 270.2, altitudeM: 109.9, gsdCm: 4.2, rtkFix: 'Fixed', shutterSpeed: '1/1600s', timestamp: '08:17:58' }
  ]
};

export const ALL_DRONE_MISSIONS: DroneMission[] = [
  INDIRANAGAR_DRONE_MISSION,
  ULSOOR_DRONE_MISSION
];
