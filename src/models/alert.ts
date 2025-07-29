import { Detection } from "./detection";

export interface Alert {
    id: string;
    detectionId: string;
    detection?: Detection;
}