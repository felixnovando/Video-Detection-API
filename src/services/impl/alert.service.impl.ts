import { normalizeKey } from "../../utils";
import { Alert, Detection } from "../../models";
import { AlertRepository } from "../../repository/api/alert.repository.api";
import { DEFAULTS, DetectionRule, DetectionTypes, KEYS } from "../../types";
import { AlertService } from "../api/alert.service.api";

export class AlertServiceImpl implements AlertService {
    detectionRules: Record<DetectionTypes, DetectionRule>;
    alertRepository: AlertRepository;

    constructor(
        alertRepository: AlertRepository,
        detectionRules: Record<DetectionTypes, DetectionRule>
    ) {
        this.alertRepository = alertRepository;
        this.detectionRules = detectionRules;
    }

    async insertAlerts(detections: Detection[]) {
        const alerts: Alert[] = [];

        for(const detection of detections) {
            if(this.isAlertEligible(detection)) {
                alerts.push({ id: DEFAULTS.ID, detectionId: detection.id });
            }
        }
        this.alertRepository.insertAlerts(alerts);
    }

    protected isAlertEligible(detection: Detection): boolean {
        const metadata = Object.fromEntries(
            Object.entries(detection.metadata).map(([key, value]) => {
                return [normalizeKey(key), value]
            })
        );
        
        const constraint = this.detectionRules[detection.type];

        if(!constraint) {
            return false;
        }

        if(metadata[KEYS.ROOT] !== constraint.xmlRootElement) {
            return false;
        }

        if(detection.confidence < constraint.confidence) {
            return false;
        }

        // check for required metadata attributes
        for(const metadataAttribute of constraint.metadataAttributes) {
            const normalizedKey = normalizeKey(metadataAttribute);
            if(!metadata[normalizedKey]) {
                return false;
            }
        }
        return true;
    }

    getAllAlerts(): Promise<Alert[]> {
        return this.alertRepository.getAllAlerts();
    }
}