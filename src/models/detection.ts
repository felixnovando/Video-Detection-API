import { DetectionTypes } from "./detection-types";
import { Frame } from "./frame";

export interface Detection{
    id: string;
    type: DetectionTypes;
    confidence: number;
    boundingBox: number[];
    metadata: string;
    frameId: string;
    frame?: Frame;
}
