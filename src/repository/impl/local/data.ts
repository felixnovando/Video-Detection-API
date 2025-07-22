import { Alert, Detection, Frame } from "../../../models";

export interface LocalData{
    frames: Frame[];
    detections: Detection[];
    alerts: Alert[];
};

export interface AccessLocalData {
    data: LocalData;
}