import { Alert } from "../../models";
import { AlertRepository } from "../../repository/api/alert.repository.api";
import { AlertService } from "../api/alert.service.api";

export class AlertServiceImpl implements AlertService{
    alertRepository: AlertRepository;

    constructor (alertRepository: AlertRepository) {
        this.alertRepository = alertRepository;
    }

    async getAllAlerts(): Promise<Alert[]> {
        return [];
    }
}