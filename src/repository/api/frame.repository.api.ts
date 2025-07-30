import { Frame } from "../../models";

export interface FrameRepository {
    getAllFrames: () => Promise<Frame[]>;
    getFrame: (id: string) => Promise<Frame | null>
    insertFrame: (frames: Frame) => Promise<Frame>;
}