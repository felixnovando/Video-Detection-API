import { Request, Response } from 'express';
import { BaseRouter } from './router';
import { AlertService } from '../services/api/alert.service.api';
import { Alert } from '../models';
import { ResponseHelper } from '../utils/responseHelper';

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
            res.json(ResponseHelper.success<Alert[]>(alerts));
        } catch (error) {
            const errorMessage = `Failed in getAlert, ${error}`;
            res.status(500).json(ResponseHelper.fail(errorMessage));
        }
    }
}