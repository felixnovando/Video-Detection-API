import { Alert } from "../../models";

export interface AlertRepository {
    getAllAlerts: () => Promise<Alert[]>;
    insertAlerts: (alerts: Alert[]) => Promise<Alert[]>;
}
