import { InsertFrameDTO } from "../../dto";
import { Detection } from "../../models";
import { DetectionRepository } from "../../repository/api/detection.repository.api";
import { FrameRepository } from "../../repository/api/frame.repository.api";
import { DetectionTypes } from "../../types";
import { AlertService } from "../api/alert.service.api";
import { DetectionService } from "../api/detection.service.api";
import { DetectionServiceImpl } from "./detection.service.impl";

describe("DetectionServiceImpl", () => {
    let service: DetectionService;

    const SAMPLE_FRAME_INPUT: InsertFrameDTO = {
        frameId: "frame-001",
        frameHeight: 500,
        frameWidth: 500,
        timestamp: "2025-07-07T14:20:30Z",
        frameUrl: "/mnt/storage/test1.jpg",
        detections: [
            {
                frameId: "frame-001",
                type: DetectionTypes.RedLightViolation,
                confidence: 0.95,
                boundingBox: [0.1, 0.2, 0.3, 0.3],
                metadata: "<RedLightViolation licensePlate=\"B1234XYZ\" location=\"Junction 5\" />",
            }
        ]
    };

    const SAMPLE_DETECTION_DATA: Detection = {
        id: "detection-001",
        frameId: "frame-001",
        type: DetectionTypes.RedLightViolation,
        confidence: 0.95,
        boundingBox: {
            left: 0.1,
            top: 0.2,
            width: 0.3,
            height: 0.3
        },
        metadata: {
            "root": "<RedLightViolation/>",
            "licensePlate": "B1234XYZ",
            "location": "Junction 5"
        },
        frame: {
            id: "frame-001",
            height: 500,
            width: 500,
            timestamp: "2025-07-07T14:20:30Z",
            url: "/mnt/storage/test1.jpg"
        }
    };

    const detectionRepository: jest.Mocked<DetectionRepository> = {
        getAllDetections: jest.fn().mockReturnValue([SAMPLE_DETECTION_DATA]),
        getDetectionsAroundTimestamp: jest.fn(),
        insertDetections: jest.fn()
    };

    const alertService: jest.Mocked<AlertService> = {
        insertAlerts: jest.fn(),
        getAllAlerts: jest.fn(), 
        alertRepository: {} as any,
        detectionRules: {} as any,
    };

    const frameRepository: jest.Mocked<FrameRepository> = {
        insertFrame: jest.fn().mockImplementation((frame) => Promise.resolve(frame)),
        getAllFrames: jest.fn(),
        getFrame: jest.fn()
    }

    beforeEach(() => {
        service = new DetectionServiceImpl(alertService, detectionRepository, frameRepository);
    });

    it("should return detections", async () => {
        const detections = await service.getAllDetections();
        expect(detections.length).not.toEqual(0);
        expect(service.detectionRepository.getAllDetections).toHaveBeenCalled();
        expect(service.detectionRepository.getAllDetections).toHaveBeenCalledTimes(1);
    });

    describe("receiveFrame", () => {
        describe("receiveFrames", () => {
            beforeEach(() => {
                const overiddenDetectionRepository: jest.Mocked<DetectionRepository> = {
                    getAllDetections: jest.fn(),
                    getDetectionsAroundTimestamp: jest.fn().mockReturnValue([]),
                    insertDetections: jest.fn()
                };
                service = new DetectionServiceImpl(alertService, overiddenDetectionRepository, frameRepository);
            });

            it("should insert detection when no similar detection exists nearby", async () => {
                const frameInput: InsertFrameDTO[] = [SAMPLE_FRAME_INPUT];
                await service.receiveFrames(frameInput);

                const getDetectionsAroundTimestampSpy = jest.spyOn(service.detectionRepository, "getDetectionsAroundTimestamp");
                const insertDetectionsSpy = jest.spyOn(service.detectionRepository, "insertDetections");

                expect(getDetectionsAroundTimestampSpy).toHaveBeenCalled();
                expect(getDetectionsAroundTimestampSpy).toHaveBeenCalledTimes(frameInput.length);
                expect(insertDetectionsSpy).toHaveBeenCalled();
            });
        });

        describe("receiveFrames", () => {
            beforeEach(() => {
                const overiddenDetectionRepository: jest.Mocked<DetectionRepository> = {
                    getAllDetections: jest.fn(),
                     getDetectionsAroundTimestamp: jest.fn().mockReturnValue([SAMPLE_DETECTION_DATA]),
                    insertDetections: jest.fn()
                };
                service = new DetectionServiceImpl(alertService, overiddenDetectionRepository, frameRepository);
            });

            it("should skip inserting detection when similar detection exists nearby", async () => {
                const frameInput: InsertFrameDTO[] = [SAMPLE_FRAME_INPUT];
                await service.receiveFrames(frameInput);

                const getDetectionsAroundTimestampSpy = jest.spyOn(service.detectionRepository, "getDetectionsAroundTimestamp");
                const insertDetectionsSpy = jest.spyOn(service.detectionRepository, "insertDetections");

                expect(getDetectionsAroundTimestampSpy).toHaveBeenCalled();
                expect(getDetectionsAroundTimestampSpy).toHaveBeenCalledTimes(frameInput.length);
                expect(insertDetectionsSpy).not.toHaveBeenCalled();
            });
        });
    });
});