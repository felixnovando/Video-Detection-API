import { Detection } from "./detection";

export type Frame = {
    frameId: string;
    timestamp: string;
    frameUrl: string;
    frameWidth: string;
    frameHeight: number;
    detections: Detection[];
}
