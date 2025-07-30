import { DetectionTypes } from "../types";

export interface InsertDetectionDTO {
    type: DetectionTypes;
    confidence: number;
    boundingBox: number[];
    metadata: string;
    frameId: string;
};