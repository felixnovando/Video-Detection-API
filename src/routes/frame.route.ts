import { Request, Response } from 'express';
import { APIBaseResponse, Status } from '../types';
import { BaseRouter } from './router';
import { DetectionService } from '../services/api/detection.service.api';
import { InsertFrameDTO } from '../dto';

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

            const response: APIBaseResponse<null> =  {
                data: null,
                status: Status.SUCCESS,
                message: null
            };
            res.json(response);
        } catch (error) {
            const errorMessage = `Failed in receiveFrame, ${error}`
            const response: APIBaseResponse<null> = {
                data: null,
                status: Status.FAILED,
                message: errorMessage
            }
            res.status(500).json(response);
        }
    }
}