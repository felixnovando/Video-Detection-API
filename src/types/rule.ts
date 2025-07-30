import { DetectionTypes } from "./detection-type";

export interface DetectionRule{
    type: DetectionTypes;
    confidence: number;
    xmlRootElement: string;
    metadataAttributes: string[];
};
