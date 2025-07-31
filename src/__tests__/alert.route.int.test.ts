import express, { Express } from 'express';
import request from 'supertest';
import { AlertService } from '../services/api/alert.service.api';
import { Alert } from '../models';
import { AlertRouter } from '../routes/alert.router';
import { APIBaseResponse, Status } from '../types';

describe("AlertRouter Integration", () => {
  let app: Express;
  let mockAlertService: jest.Mocked<AlertService>;

  const mockedAlerts: Alert[] = [
    { id: "alert-001", detectionId: "detection-001" },
    { id: "alert-002", detectionId: "detection-002" },
    { id: "alert-003", detectionId: "detection-003" },
    { id: "alert-004", detectionId: "detection-004" },
    { id: "alert-005", detectionId: "detection-005" },
  ];

  beforeEach(() => {
    mockAlertService = {
      getAllAlerts: jest.fn().mockResolvedValue(mockedAlerts),
      insertAlerts: jest.fn(),
      alertRepository: {} as any,
      detectionRules: {} as any,
    };

    app = express();
    app.use(express.json());
    const router = new AlertRouter(mockAlertService);
    app.use("/alert", router.getRouter());
  });

  test("GET / should return alerts with 200", async () => {
    const res = await request(app).get("/alert");
    expect(res.status).toBe(200);

    const body: APIBaseResponse<Alert[]> = res.body;
    expect(body.data).toEqual(mockedAlerts);
    expect(body.message).toBeNull();
    expect(body.status).toEqual(Status.SUCCESS);

    expect(mockAlertService.getAllAlerts).toHaveBeenCalledTimes(1);
  });

  test("GET / should return 500 on error", async () => {
    mockAlertService.getAllAlerts = jest.fn().mockImplementation(() => {
        throw new Error("Something went wrong")
    });
    const res = await request(app).get("/alert");
    expect(res.status).toBe(500);

    const body: APIBaseResponse<Alert[]> = res.body;
    expect(body.data).toBeNull();
    expect(body.message).toContain("Something went wrong")
    expect(body.status).toEqual(Status.FAILED);
  });
});
