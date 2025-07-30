import { Alert, Detection } from "../../models";
import { AlertRepository } from "../../repository/api/alert.repository.api";
import { DetectionRule, DetectionTypes } from "../../types";

export interface AlertService {
    alertRepository: AlertRepository;
    detectionRules: Record<DetectionTypes, DetectionRule>;
    getAllAlerts: () => Promise<Alert[]>;
    insertAlerts: (detections: Detection[]) => Promise<void>;
}
