import { Alert } from "../../models";
import { AlertRepository } from "../../repository/api/alert.repository.api";

export interface AlertService {
    alertRepository: AlertRepository;
    getAllAlerts: () => Promise<Alert[]>;
}
