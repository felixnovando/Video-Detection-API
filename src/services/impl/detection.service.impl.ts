import { Frame, Detection } from "../../models";
import { DetectionRepository } from "../../repository/api/detection.repository.api";
import { FrameRepository } from "../../repository/api/frame.repository.api";
import { DetectionService } from "../api/detection.service.api";

export class DetectionServiceImpl implements DetectionService {
    frameRepository: FrameRepository;
    detectionRepository: DetectionRepository;
    
    constructor(frameRepository: FrameRepository, detectionRepository: DetectionRepository) {
        this.frameRepository = frameRepository;
        this.detectionRepository = detectionRepository;
    }

    receiveFrames(frames: Frame[]): void {

    }

    async getAllDetections(): Promise<Detection[]> {
        return [];
    }
}