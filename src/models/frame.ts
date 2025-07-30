import { Detection } from "./detection";

export type Frame = {
    id: string;
    timestamp: string;
    url: string;
    width: number;
    height: number;
    detections?: Detection[];
}
