import { Alert } from "../../../models";
import { DEFAULTS, DetectionTypes } from "../../../types";
import { AlertRepository } from "../../api/alert.repository.api";
import { AlertRepositoryLocal } from "./alert.local.repository";

describe("AlertRepositoryLocal - with preloaded alerts and detection", () => {
    let repository: AlertRepository;

    const SAMPLE_DETECTION_ID = "detection-001";
    const SAMPLE_DETECTION_ID_2 = "detection-002";
    const SAMPLE_ALERT_ID = "alert-001";
    const SAMPLE_ALERT_ID_2 = "alert-002";

    beforeEach(() => {
        const localData = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };
        const alerts: Alert[] = [
            {
                id: SAMPLE_ALERT_ID,
                detectionId: SAMPLE_DETECTION_ID,
                detection: {
                    id: SAMPLE_DETECTION_ID,
                    type: DetectionTypes.RedLightViolation,
                    confidence: 0.98,
                    boundingBox: { left: 0.1, top: 0.2, width: 0.6, height: 0.5 },
                    metadata: {
                        "licensePlate": "B1234XYZ",
                        "location": "Junction 5",
                    },
                    frameId: "frame-001"
                }
            },
            {
                id: SAMPLE_ALERT_ID_2,
                detectionId: SAMPLE_DETECTION_ID_2,
                detection: {
                    id: SAMPLE_DETECTION_ID_2,
                    type: DetectionTypes.VehicleOverspeeding,
                    confidence: 0.85,
                    boundingBox: { left: 0.1, top: 0.1, width: 0.4, height: 0.6 },
                    metadata: {
                        "licensePlate": "S5678ABC",
                        "speed": "85"
                    },
                    frameId: "frame-001"
                }
            }
        ];
        for(const alert of alerts) {
            localData.alerts.set(alert.id, alert);
            localData.detections.set(alert.detectionId, alert.detection);
        }
        repository = new AlertRepositoryLocal(localData);
    });

    it("should return alerts in repository along with the detection", async () => {
        const alerts = await repository.getAllAlerts();
        expect(alerts.length).toBe(2);
        expect(alerts[0].detection).toBeDefined();
        expect(alerts[0].detection?.type).toEqual(DetectionTypes.RedLightViolation);
        expect(alerts[1].detection).toBeDefined();
        expect(alerts[1].detection?.type).toEqual(DetectionTypes.VehicleOverspeeding);
    });
});

describe("AlertRepositoryLocal - empty data", () => {
    let repository: AlertRepository;

    beforeEach(() => {
        const EMPTY_DATA = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };
        repository = new AlertRepositoryLocal(EMPTY_DATA);
    });

    it("should insert alerts and assign a new UUID to each alert", async () => {
        const alerts = await repository.insertAlerts([
            {
                id: DEFAULTS.ID,
                detectionId: "detection-001",
            },
            {
                id: DEFAULTS.ID,
                detectionId: "detection-002"
            }
        ]);
        expect(alerts.length).toBe(2);
        expect(alerts[0]).not.toEqual(DEFAULTS.ID);
        expect(alerts[0].id).not.toEqual(alerts[1].id);
    });
});