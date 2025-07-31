import express, { Express } from 'express';
import request from 'supertest';
import { Detection } from '../models';
import { DetectionService } from '../services/api/detection.service.api';
import { DetectionRouter } from '../routes/detection.router';
import { APIBaseResponse, DetectionTypes, Status } from '../types';

describe("DetectionRouter Integration", () => {
  let app: Express;
  let mockDetectionService: jest.Mocked<DetectionService>;

  const mockedDetections: Detection[] = [
    {
      id: "detection-001",
      type: DetectionTypes.RedLightViolation,
      confidence: 0.95,
      boundingBox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 },
      metadata: {
        "root": "<RedLightViolation/>",
        "licensePlate": "B1234XYZ", 
        "location": "Junction 1" 
      },
      frameId: "frame-001",
    },
    {
      id: "detection-002",
      type: DetectionTypes.VehicleOverspeeding,
      confidence: 0.87,
      boundingBox: { left: 0.3, top: 0.2, width: 0.2, height: 0.2 },
      metadata: { 
        "root": "<VehicleOverspeeding/>",
        "licensePlate": "S5678ABC", 
        "speed": "90" 
      },
      frameId: "frame-002",
    }
  ];

  beforeEach(() => {
    mockDetectionService = {
      getAllDetections: jest.fn().mockResolvedValue(mockedDetections),
      receiveFrames: jest.fn(),
      detectionRepository: {} as any,
      frameRepository: {} as any
    };

    app = express();
    app.use(express.json());
    const router = new DetectionRouter(mockDetectionService);
    app.use("/detection", router.getRouter());
  });

  test("GET / should return detections with 200", async () => {
    const res = await request(app).get("/detection");
    expect(res.status).toBe(200);

    const body: APIBaseResponse<Detection[]> = res.body;
    expect(body.data).toEqual(mockedDetections);
    expect(body.message).toBeNull();
    expect(body.status).toEqual(Status.SUCCESS);

    expect(mockDetectionService.getAllDetections).toHaveBeenCalledTimes(1);
  });

  test("GET / should return 500 on error", async () => {
    mockDetectionService.getAllDetections = jest.fn().mockImplementation(() => {
      throw new Error("Something went wrong");
    });

    const res = await request(app).get("/detection");
    expect(res.status).toBe(500);

    const body: APIBaseResponse<Detection[]> = res.body;
    expect(body.data).toBeNull();
    expect(body.message).toContain("Something went wrong");
    expect(body.status).toEqual(Status.FAILED);
  });
});
