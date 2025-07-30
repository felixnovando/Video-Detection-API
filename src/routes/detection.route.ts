import { Request, Response } from 'express';
import { APIBaseResponse, Status } from '../types';
import { BaseRouter } from './router';
import { DetectionService } from '../services/api/detection.service.api';
import { Detection } from '../models';

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

            const response: APIBaseResponse<Detection[]> =  {
                data: detections,
                status: Status.SUCCESS,
                message: null
            };
            res.json(response);
        } catch (error) {
            const errorMessage = `Failed in getDetection, ${error}`
            const response: APIBaseResponse<null> = {
                data: null,
                status: Status.FAILED,
                message: errorMessage
            }
            res.status(500).json(response);
        }
    }
}
