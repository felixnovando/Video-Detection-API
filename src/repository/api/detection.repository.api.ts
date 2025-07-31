import { Detection } from "../../models";

export interface DetectionRepository {
    getAllDetections: () => Promise<Detection[]>;
    insertDetections: (detections: Detection[]) => Promise<Detection[]>;
    getDetectionsAroundTimestamp: (timestamp: string, seconds: number) => Promise<Detection[]>;
}
