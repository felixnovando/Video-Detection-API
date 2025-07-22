import { DetectionTypes } from "./detection-types";

export interface Detection{
    id: string;
    type: DetectionTypes;
    confidence: number;
    boundingBox: number[];
    metadata: string;
}
