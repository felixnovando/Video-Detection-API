import { Alert } from "../../../models";
import { AlertRepository } from "../../api/alert.repository.api";
import { AccessLocalData, LocalData } from "./data";
import { v4 as uuidv4 } from 'uuid';

export class AlertRepositoryLocal implements AlertRepository, AccessLocalData{
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }

    async getAllAlerts() {
        return [...this.data.alerts.values()].map((alert => ({
            ...alert,
            detection: this.data.detections.get(alert.detectionId)
        })))
    };

    async insertAlerts (alerts: Alert[]) {
        const results:Alert[] = [];
        for (const alert of alerts) {
            const id = uuidv4();
            const data = {...alert, id}
            this.data.alerts.set(id, data);
            results.push(data);
        }
        return results;
    }
}