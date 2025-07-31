import { Detection, Frame } from "../../../models";
import { DetectionTypes } from "../../../types";
import { DetectionRepository } from "../../api/detection.repository.api";
import { DetectionRepositoryLocal } from "./detection.local.respository";

function isWithinNSecond(timestamp1: string, timestamp2: string, seconds: number) {
    return Math.abs(new Date(timestamp1).getTime() - new Date(timestamp2).getTime()) < seconds * 1000;
}

describe("DetectionRepositoryLocal - with preloaded detection and frames", () => {
    let repository: DetectionRepository;

    beforeEach(() => {
        const localData = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };

        const frames: Frame[] = [
            {
                id: "frame-001",
                timestamp: "2025-07-07T14:20:31Z",
                url: "/mnt/storage/frame001.jpg",
                width: 1280,
                height: 720,
            },
            {
                id: "frame-002",
                timestamp: "2025-07-07T14:20:35Z",
                url: "/mnt/storage/frame002.jpg",
                width: 1280,
                height: 720,
            },
            {
                id: "frame-003",
                timestamp: "2025-07-07T14:20:40Z",
                url: "/mnt/storage/frame003.jpg",
                width: 1280,
                height: 720,
            }
        ];

        const detections: Detection[] = [
            {
                id: "detection-001",
                type: DetectionTypes.RedLightViolation,
                confidence: 0.95,
                boundingBox: { left: 0.1, top: 0.2, width: 0.3, height: 0.3 },
                metadata: { "licensePlate": "B1234XYZ", "location": "Junction 5" },
                frameId: frames[0].id,
            },
            {
                id: "detection-002",
                type: DetectionTypes.VehicleOverspeeding,
                confidence: 0.88,
                boundingBox: { left: 0.4, top: 0.3, width: 0.2, height: 0.25 },
                metadata: { "licensePlate": "S5678ABC", "speed": "85" },
                frameId: frames[0].id,
            },
            {
                id: "detection-003",
                type: DetectionTypes.UnauthorizedVehicle,
                confidence: 0.76,
                boundingBox: { left: 0.6, top: 0.4, width: 0.25, height: 0.35 },
                metadata: { "licensePlate": "G9101DEF", "location": "Lot A" },
                frameId: frames[0].id,
            },
            {
                id: "detection-004",
                type: DetectionTypes.RedLightViolation,
                confidence: 0.92,
                boundingBox: { left: 0.2, top: 0.2, width: 0.3, height: 0.3 },
                metadata: { "licensePlate": "D2345LMN", "location": "Junction 2" },
                frameId: frames[1].id,
            },
            {
                id: "detection-005",
                type: DetectionTypes.VehicleOverspeeding,
                confidence: 0.89,
                boundingBox: { left: 0.3, top: 0.3, width: 0.2, height: 0.25 },
                metadata: { "licensePlate": "E6789XYZ", "speed": "90" },
                frameId: frames[1].id,
            },
            {
                id: "detection-006",
                type: DetectionTypes.UnauthorizedVehicle,
                confidence: 0.78,
                boundingBox: { left: 0.1, top: 0.1, width: 0.5, height: 0.4 },
                metadata: { "licensePlate": "F0001ZZZ", "location": "Lot B" },
                frameId: frames[2].id,
            },
        ];

        for(const frame of frames) {
            localData.frames.set(frame.id, frame);
        }
        for(const detection of detections) {
            localData.detections.set(detection.id, detection);
        }
        repository = new DetectionRepositoryLocal(localData);
    });

    it("should return detections in repository along with the frame", async () => {
        const detections = await repository.getAllDetections();
        expect(detections.length).toBe(6);
        expect(detections[0].frame).toBeDefined();
        expect(detections[0].frame).toStrictEqual(detections[1].frame);
        expect(detections[1].frame).toStrictEqual(detections[2].frame);
    });

    it("should return detections around given timestamp and interval", async () => {
        const timestamp = "2025-07-07T14:20:33Z";
        const interval = 3;
        const detections = await repository.getDetectionsAroundTimestamp(timestamp, 3);
        expect(detections.length).toBe(5);
        for(const detection of detections) {
            expect(isWithinNSecond(detection.frame!.timestamp, timestamp, interval)).toBeTruthy();
        }
    })
});

describe("DetectionRepositoryLocal - empty data", () => {
    let repository: DetectionRepository;

    beforeEach(() => {
        const EMPTY_DATA = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };
        repository = new DetectionRepositoryLocal(EMPTY_DATA);
    });

    it("should insert detections and assign a new UUID to each detection", async () => {
        const detectionInputs: Detection[] = [
            {
                id: "detection-001",
                type: DetectionTypes.RedLightViolation,
                confidence: 0.95,
                boundingBox: { left: 0.1, top: 0.2, width: 0.3, height: 0.3 },
                metadata: {
                    "licensePlate": "B1234XYZ",
                    "location": "Junction 5",
                },
                frameId: ""
            },
            {
                id: "detection-002",
                type: DetectionTypes.VehicleOverspeeding,
                confidence: 0.88,
                boundingBox: { left: 0.4, top: 0.3, width: 0.2, height: 0.25 },
                metadata: {
                    "licensePlate": "S5678ABC",
                    "speed": "85",
                },
                frameId: ""
            }
        ];
        const detections = await repository.insertDetections(detectionInputs);
        expect(detections.length).toBe(2);
        expect(detections[0].type).toEqual(DetectionTypes.RedLightViolation);
        expect(detections[1].type).toEqual(DetectionTypes.VehicleOverspeeding);
    });
});