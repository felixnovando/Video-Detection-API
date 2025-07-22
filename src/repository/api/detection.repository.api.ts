import { Detection } from "../../models";

export interface DetectionRepository {
    getAllDetections: () => Promise<Detection[]>;
    insertDetections: (detections: Detection[]) => void;
}
