import { Request, Response } from 'express';
import { APIBaseResponse, Status } from '../types';
import { BaseRouter } from './router';
import { AlertService } from '../services/api/alert.service.api';

export class AlertRouter extends BaseRouter {
    private alertService: AlertService;

    constructor (alertService: AlertService) {
        super();
        this.alertService = alertService;
    }

    setRouter(): void {
        this.router.get("/", (_: Request, res: Response) => {
            const response: APIBaseResponse<string> =  {
                data: "get alert not implemented",
                status: Status.SUCCESS,
                message: null
            };
            res.json(response);
        });
    }
}
