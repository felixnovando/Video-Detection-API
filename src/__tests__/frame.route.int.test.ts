import express, { Express } from 'express';
import request from 'supertest';
import { FrameRouter } from '../routes/frame.router';
import { DetectionService } from '../services/api/detection.service.api';
import { InsertFrameDTO } from '../dto';
import { APIBaseResponse, DetectionTypes, Status } from '../types';

describe("FrameRouter Integration", () => {
  let app: Express;
  let mockDetectionService: jest.Mocked<DetectionService>;

  const mockPayload: InsertFrameDTO[] = [
    {
      frameId: "frame-001",
      frameHeight: 720,
      frameWidth: 1280,
      timestamp: "2025-07-29T14:00:00Z",
      frameUrl: "/mnt/storage/test.jpg",
      detections: [
        {
          type: DetectionTypes.RedLightViolation,
          confidence: 0.9,
          boundingBox: [0.1, 0.1, 0.2, 0.2],
          metadata: "<RedLightViolation licensePlate=\"B1234XYZ\" location=\"Junction 1\"/>",
          frameId: "frame-001"
        }
      ]
    }
  ];

  beforeEach(() => {
    mockDetectionService = {
      getAllDetections: jest.fn(),
      receiveFrames: jest.fn().mockResolvedValue(undefined),
      detectionRepository: {} as any,
      frameRepository: {} as any
    };

    app = express();
    app.use(express.json());
    const router = new FrameRouter(mockDetectionService);
    app.use("/frame", router.getRouter());
  });

  test("POST / should return 200 on success", async () => {
    const res = await request(app).post("/frame").send(mockPayload);

    expect(res.status).toBe(200);
    const body: APIBaseResponse<null> = res.body;

    expect(body.data).toBeNull();
    expect(body.message).toBeNull();
    expect(body.status).toBe(Status.SUCCESS);

    expect(mockDetectionService.receiveFrames).toHaveBeenCalledTimes(1);
    expect(mockDetectionService.receiveFrames).toHaveBeenCalledWith(mockPayload);
  });

  test("POST / should return 500 on error", async () => {
    mockDetectionService.receiveFrames = jest.fn().mockImplementation(() => {
      throw new Error("Insert failed");
    });

    const res = await request(app).post("/frame").send(mockPayload);
    const body: APIBaseResponse<null> = res.body;

    expect(res.status).toBe(500);
    expect(body.status).toBe(Status.FAILED);
    expect(body.message).toContain("Insert failed");
    expect(body.data).toBeNull();
  });
});
