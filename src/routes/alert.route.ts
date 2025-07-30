import { Request, Response } from 'express';
import { APIBaseResponse, Status } from '../types';
import { BaseRouter } from './router';
import { AlertService } from '../services/api/alert.service.api';
import { Alert } from '../models';

export class AlertRouter extends BaseRouter {
    private alertService: AlertService;

    constructor (alertService: AlertService) {
        super();
        this.alertService = alertService;
    }

    setRouter(): void {
        this.router.get("/", (req, res) => this.getAlert(req, res));
    }

    private async getAlert(_: Request, res: Response) {
        try {
            const alerts = await this.alertService.getAllAlerts();
        
            const response: APIBaseResponse<Alert[]> =  {
                data: alerts,
                status: Status.SUCCESS,
                message: null
            };
            res.json(response);
        } catch (error) {
            const errorMessage = `Failed in getAlert, ${error}`
            const response: APIBaseResponse<null> = {
                data: null,
                status: Status.FAILED,
                message: errorMessage
            }
            res.status(500).json(response);
        }
    }
}