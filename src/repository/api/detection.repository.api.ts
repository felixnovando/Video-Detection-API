import { Detection } from "../../models";

export interface DetectionRepository {
    getAllDetections: () => Promise<Detection[]>;
    getDetection:(id: string) => Promise<Detection | null>;
    insertDetections: (detections: Detection[]) => Promise<Detection[]>;
    getDetectionsAroundTimestamp: (timestamp: string, s: number) => Promise<Detection[]>;
}
