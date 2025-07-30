import { DetectionTypes } from "../types";
import { Frame } from "./frame";

export interface Detection{
    id: string;
    type: DetectionTypes;
    confidence: number;
    boundingBox: DetectionBox;
    metadata: Record<string, string>;
    frameId: string;
    frame?: Frame;
}

export interface DetectionBox {
    left: number;
    top: number;
    width: number;
    height: number;
}