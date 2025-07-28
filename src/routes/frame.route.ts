import { Request, Response } from 'express';
import { APIBaseResponse, Status } from '../types';
import { BaseRouter } from './router';
import { DetectionService } from '../services/api/detection.service.api';

export class FrameRouter extends BaseRouter{    
    private detectionService: DetectionService;

    constructor (detectionService: DetectionService) {
        super();
        this.detectionService = detectionService;
    }

    setRouter(): void {
        this.router.post("/", (_: Request, res: Response) => {
            const response: APIBaseResponse<string> =  {
                data: "receive frame not implemented",
                status: Status.SUCCESS,
                message: null
            };
            res.json(response);
        });  
    }
}
