import { Frame } from "../../../models";
import { FrameRepository } from "../../api/frame.repository.api";
import { AccessLocalData, LocalData } from "./data";

export class FrameRepositoryLocal implements FrameRepository, AccessLocalData {
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }

    async getFrame(id: string) {
        const result = this.data.frames.get(id);
        return result ?? null;
    }
    
    async getAllFrames() {
        return [...this.data.frames.values()];
    }

    async insertFrame(frame: Frame) {
        this.data.frames.set(frame.id, frame);
        return frame;
    }
}