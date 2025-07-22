import { Frame } from "../../models";

export interface FrameRepository {
    getAllFrames: () => Promise<Frame[]>;
    insertFrames: (frames: Frame[]) => void;
}