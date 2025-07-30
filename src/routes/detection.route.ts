import { Request, Response } from 'express';
import { BaseRouter } from './router';
import { DetectionService } from '../services/api/detection.service.api';
import { Detection } from '../models';
import { ResponseHelper } from '../utils/responseHelper';

export class DetectionRouter extends BaseRouter {
    private detectionService: DetectionService;

    constructor (detectionService: DetectionService) {
        super();
        this.detectionService = detectionService;
    }

    setRouter(): void {
        this.router.get("/", (req, res) => this.getDetection(req, res)); 
    }

    private async getDetection(_: Request, res: Response) {
        try {
            const detections = await this.detectionService.getAllDetections();
            res.json(ResponseHelper.success<Detection[]>(detections));
        } catch (error) {
            const errorMessage = `Failed in getDetection, ${error}`;
            res.status(500).json(ResponseHelper.fail(errorMessage));
        }
    }
}
