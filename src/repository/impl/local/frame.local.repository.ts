import { Frame } from "../../../models";
import { FrameRepository } from "../../api/frame.repository.api";
import { AccessLocalData, LocalData } from "./data";

export class FrameRepositoryLocal implements FrameRepository, AccessLocalData {
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }
    
    async getAllFrames(): Promise<Frame[]> {
        return [];
    }

    insertFrames(frames: Frame[]) {

    }
}