import { Alert } from "../../../models";
import { AlertRepository } from "../../api/alert.repository.api";
import { AccessLocalData, LocalData } from "./data";

export class AlertRepositoryLocal implements AlertRepository, AccessLocalData{
    data: LocalData;
    constructor(data: LocalData) {
        this.data = data;
    }

    async getAllAlerts(): Promise<Alert[]> {
        return [];
    };

    insertAlerts (alerts: Alert[]) {
        
    }
}