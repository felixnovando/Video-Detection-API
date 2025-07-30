import { Detection } from "../../../models";
import { DetectionRepository } from "../../api/detection.repository.api";
import { AccessLocalData, LocalData } from "./data";
import { v4 as uuidv4 } from 'uuid';

export class DetectionRepositoryLocal implements DetectionRepository, AccessLocalData {
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }

    async getDetection(id: string){
        const result = this.data.detections.get(id);
        return result ?? null;
    }

    async getAllDetections() {
        return [...this.data.detections.values()].map(detection => ({
            ...detection,
            frame: this.data.frames.get(detection.frameId)
        }))
    }

    async insertDetections(detections: Detection[]) {
        const results: Detection[] = [];
        for(const detection of detections) {
            const id = uuidv4();
            const data = {...detection, id};
            this.data.detections.set(id, data);
            results.push(data);
        }
        return results;
    }

    async getDetectionsAroundTimestamp(timestamp: string, s: number){
        const frameIdMap: Record<string, boolean> = {};
        for(const frame of this.data.frames.values()){
            if(this.isWithinNSecond(timestamp, frame.timestamp, s)){
                frameIdMap[frame.id] = true;
            }
        }

        const nearbyDetections: Detection[] = [];
        for(const detection of this.data.detections.values()){
            if(frameIdMap[detection.frameId]){
                nearbyDetections.push({
                    ...detection,
                    frame: this.data.frames.get(detection.frameId)
                });
            }
        }
        return nearbyDetections;
    }

    private isWithinNSecond(timestamp1: string, timestamp2: string, seconds: number) {
        return Math.abs(new Date(timestamp1).getTime() - new Date(timestamp2).getTime()) < seconds * 1000;
    }
}