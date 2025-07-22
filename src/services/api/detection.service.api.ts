import { Detection, Frame } from "../../models";
import { DetectionRepository } from "../../repository/api/detection.repository.api";
import { FrameRepository } from "../../repository/api/frame.repository.api";

export interface DetectionService {
    frameRepository: FrameRepository;
    detectionRepository: DetectionRepository;
    receiveFrames: (frames: Frame[]) => void;
    getAllDetections: () => Promise<Detection[]>;
}
