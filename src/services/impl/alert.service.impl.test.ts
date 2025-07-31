import { Alert, Detection } from "../../models";
import { AlertRepository } from "../../repository/api/alert.repository.api";
import { DetectionRule, DetectionTypes, KEYS } from "../../types";
import { AlertService } from "../api/alert.service.api";
import { AlertServiceImpl } from "./alert.service.impl";

describe("AlertServiceImpl", () => {

    let service: AlertService;
    let alertRepository: jest.Mocked<AlertRepository>;

    const alerts: Alert[] = [
        {
            id: "alert-001",
            detectionId: "detection-001",
        },
        {
            id: "alert-002",
            detectionId: "detection-002",
        }
    ];

    const rules: Record<DetectionTypes, DetectionRule> = {
        "RedLightViolation": {
            type: DetectionTypes.RedLightViolation,
            confidence: 0.5,
            xmlRootElement: "<RedLightViolation/>",
            metadataAttributes: ["License Plate", "Location"]
        },
        "VehicleOverspeeding": {
            type: DetectionTypes.VehicleOverspeeding,
            confidence: 0.5,
            xmlRootElement: "<VehicleOverspeeding/>",
            metadataAttributes: ["License Plate", "Speed"]
        },
        "UnauthorizedVehicle": {
            type: DetectionTypes.UnauthorizedVehicle,
            confidence: 0.5,
            xmlRootElement: "<UnauthorizedVehicle/>",
            metadataAttributes: ["License Plate", "Location"]
        },
    }

    beforeAll(() => {
        alertRepository = {
            getAllAlerts: jest.fn().mockReturnValue(alerts),
            insertAlerts: jest.fn(),
        }
        service = new AlertServiceImpl(alertRepository, rules);
    });

    it("should return all alerts", async () => {
        const alerts = await service.getAllAlerts();
        expect(alerts.length).not.toBe(0);
    });

    it("should success inserting alerts", async () => {
        const detectionBase: Detection = {
            id: "detection-001",
            type: DetectionTypes.RedLightViolation,
            boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
            confidence: 0.6,
            metadata: {
                "root" : "<RedLightViolation/>",
                "licensePlate": "BK010K",
                "location": "Downtown"
            },
            frameId: "frame-001",
        }
        const detections: Detection[] = [
            {...detectionBase, id: "detection-001"},
            {...detectionBase, id: "detection-002", metadata: {}}, //simulates not valid detection
        ];
        await service.insertAlerts(detections);

        const insertAlertSpy = jest.spyOn(service.alertRepository, "insertAlerts");
        expect(insertAlertSpy).toHaveBeenCalled();
        expect(insertAlertSpy).toHaveBeenCalledTimes(1);
    });

    describe("isAlertEligible", () => {
        interface ExposedAlertService extends AlertService {
            isAlertEligible(detection: Detection): boolean
        }

        it("should not eligible when given invalid detection type", () => {
            const detection: Detection = {
                type: "Invalid Type" as DetectionTypes,
                boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
                confidence: 0,
                metadata: {},
                frameId: "frame-001",
                id: "detection-001"
            };
            const result = (service as ExposedAlertService).isAlertEligible(detection);
            expect(result).toBe(false);
        });

        it("should not eligible when xmlRootElement are not match", () => {
            const detection: Detection = {
                type: DetectionTypes.RedLightViolation,
                boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
                confidence: 0,
                metadata: {},
                frameId: "frame-001",
                id: "detection-001"
            };
            const result = (service as ExposedAlertService).isAlertEligible(detection);
            expect(result).toBe(false);
        });

        it("should not eligible when given insufficient confidence", () => {
            const detection: Detection = {
                type: DetectionTypes.RedLightViolation,
                boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
                confidence: 0,
                metadata: {
                    "root" : "<RedLightViolation/>"
                },
                frameId: "frame-001",
                id: "detection-001"
            };
            const result = (service as ExposedAlertService).isAlertEligible(detection);
            expect(result).toBe(false);
        });

        it("should not eligible when the metadata attributes are not complete", () => {
            const detection: Detection = {
                type: DetectionTypes.RedLightViolation,
                boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
                confidence: 60,
                metadata: {
                    "root" : "<RedLightViolation/>",
                },
                frameId: "frame-001",
                id: "detection-001"
            };
            const result = (service as ExposedAlertService).isAlertEligible(detection);
            expect(result).toBe(false);
        });

        it("success when match the criteria", () => {
            const detection: Detection = {
                type: DetectionTypes.RedLightViolation,
                boundingBox: {left: 0.1, top: 0.1, width: 0.2, height: 0.2},
                confidence: 60,
                metadata: {
                    "root" : "<RedLightViolation/>",
                    "licensePlate": "BK010K",
                    "location": "Downtown"
                },
                frameId: "frame-001",
                id: "detection-001"
            };
            const result = (service as ExposedAlertService).isAlertEligible(detection);
            expect(result).toEqual(true);
        });
    })
});