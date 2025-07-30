import { InsertFrameDTO } from "../../dto";
import { Detection } from "../../models";
import { DetectionRepository } from "../../repository/api/detection.repository.api";
import { FrameRepository } from "../../repository/api/frame.repository.api";

export interface DetectionService {
    frameRepository: FrameRepository;
    detectionRepository: DetectionRepository;
    receiveFrames: (frameInputs: InsertFrameDTO[]) => Promise<void>;
    getAllDetections: () => Promise<Detection[]>;
}
