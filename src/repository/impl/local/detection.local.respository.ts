import { Detection } from "../../../models";
import { DetectionRepository } from "../../api/detection.repository.api";
import { AccessLocalData, LocalData } from "./data";

export class DetectionRepositoryLocal implements DetectionRepository, AccessLocalData {
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }

    async getAllDetections(): Promise<Detection[]> {
        return [];
    }

    insertDetections(detections: Detection[]){

    }
}