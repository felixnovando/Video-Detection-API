import { Request, Response } from 'express';
import { BaseRouter } from './router';
import { DetectionService } from '../services/api/detection.service.api';
import { InsertFrameDTO } from '../dto';
import { ResponseHelper } from '../utils/responseHelper';

export class FrameRouter extends BaseRouter{    
    private detectionService: DetectionService;

    constructor (detectionService: DetectionService) {
        super();
        this.detectionService = detectionService;
    }

    setRouter(): void {
        this.router.post("/", (req, res) => this.receiveFrame(req, res));  
    }

    private async receiveFrame(req: Request, res: Response) {
        try {
            const data: InsertFrameDTO[] = req.body;
            this.detectionService.receiveFrames(data);

            res.json(ResponseHelper.success(null));
        } catch (error) {
            const errorMessage = `Failed in receiveFrame, ${error}`;
            res.status(500).json(ResponseHelper.fail(errorMessage));
        }
    }
}