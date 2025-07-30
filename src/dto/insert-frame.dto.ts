import { InsertDetectionDTO } from "./insert-detection.dto";

export type InsertFrameDTO = {
    frameId: string;
    timestamp: string;
    frameUrl: string;
    frameWidth: number;
    frameHeight: number;
    detections: InsertDetectionDTO[];
};