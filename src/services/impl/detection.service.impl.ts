import { checkBoundingBoxOverlap, parseXmlToMetadata } from "../../utils";
import { Frame, Detection } from "../../models";
import { DetectionRepository } from "../../repository/api/detection.repository.api";
import { FrameRepository } from "../../repository/api/frame.repository.api";
import { DEFAULTS } from "../../types";
import { AlertService } from "../api/alert.service.api";
import { DetectionService } from "../api/detection.service.api";
import { InsertDetectionDTO, InsertFrameDTO } from "../../dto";

export class DetectionServiceImpl implements DetectionService {
    frameRepository: FrameRepository;
    detectionRepository: DetectionRepository;
    alertService: AlertService;
    
    constructor(
        alertService: AlertService,
        detectionRepository: DetectionRepository,
        frameRepository: FrameRepository
    ) {
        this.alertService = alertService;
        this.detectionRepository = detectionRepository;
        this.frameRepository = frameRepository;
    }

    async receiveFrames(frameInputs: InsertFrameDTO[]) {
        const validDetections: Detection[] = [];

        for(const frameInput of frameInputs) {
            const frame = this.convertFrame(frameInput);
            const insertedFrame = await this.frameRepository.insertFrame(frame);

            const detections = frameInput.detections.map(detection => this.convertDetection({...detection, frameId: insertedFrame.id}));
            const nearbyDetections = await this.detectionRepository.getDetectionsAroundTimestamp(frame.timestamp, 3);

            for(const detection of detections) {
                let similarDetections = [...nearbyDetections];

                similarDetections = similarDetections.filter((otherDetection) => 
                    frame.url === otherDetection.frame?.url && // same frameUrl
                    detection.type === otherDetection.type && // same detection type
                    checkBoundingBoxOverlap(detection.boundingBox, otherDetection.boundingBox) // check bounding box is overlapping
                );

                if(similarDetections.length === 0) {
                    validDetections.push(detection);
                }
            }
        }
        // insert detections
        const insertedDetections = await this.detectionRepository.insertDetections(validDetections);
        
        // insert alerts
        this.alertService.insertAlerts(insertedDetections);
    }

    async getAllDetections(): Promise<Detection[]> {
        return this.detectionRepository.getAllDetections();
    }

    private convertFrame = (input: InsertFrameDTO): Frame => {
        return {
            id: input.frameId,
            height: input.frameHeight,
            width: input.frameWidth,
            url: input.frameUrl,
            timestamp: input.timestamp
        }
    }

    private convertDetection = (input: InsertDetectionDTO): Detection => {
        return {
            id: DEFAULTS.ID,
            type: input.type,
            frameId: input.frameId,
            confidence: input.confidence,
            boundingBox: {
                left: input.boundingBox[0],
                top: input.boundingBox[1],
                width: input.boundingBox[2],
                height: input.boundingBox[3],
            },
            metadata: parseXmlToMetadata(input.metadata)
        }
    }
}