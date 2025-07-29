import { Alert, Detection, Frame } from "../../../models";

export interface LocalData{
    frames: Map<string, Frame>;
    detections: Map<string, Detection>;
    alerts: Map<string, Alert>;
};

export interface AccessLocalData {
    data: LocalData;
}