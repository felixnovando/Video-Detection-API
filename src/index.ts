import dotenv from "dotenv";
import express from "express";

import { AlertRouter } from "./routes/alert.route";
import { DetectionRouter } from "./routes/detection.route";
import { FrameRouter } from "./routes/frame.route";
import { APIRouter } from "./routes/router";
import { AlertRepositoryLocal } from "./repository/impl/local/alert.local.repository";
import { AlertRepository } from "./repository/api/alert.repository.api";
import { LocalData } from "./repository/impl/local/data";
import { DetectionRepository } from "./repository/api/detection.repository.api";
import { DetectionRepositoryLocal } from "./repository/impl/local/detection.local.respository";
import { FrameRepository } from "./repository/api/frame.repository.api";
import { FrameRepositoryLocal } from "./repository/impl/local/frame.local.repository";
import { AlertService } from "./services/api/alert.service.api";
import { AlertServiceImpl } from "./services/impl/alert.service.impl";
import { DetectionService } from "./services/api/detection.service.api";
import { DetectionServiceImpl } from "./services/impl/detection.service.impl";
import { DetectionRule, DetectionTypes } from "./types";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

// local data
const localData: LocalData = {
    alerts: new Map(),
    detections: new Map(),
    frames: new Map()
};

// repositories
const alertRepository: AlertRepository = new AlertRepositoryLocal(localData);
const detectionRepository: DetectionRepository = new DetectionRepositoryLocal(localData);
const frameRepository: FrameRepository = new FrameRepositoryLocal(localData);

// define rulesets for alert
const alertDetectionRules: Record<DetectionTypes, DetectionRule> = {
    "RedLightViolation": {
        type: DetectionTypes.RedLightViolation,
        confidence: 0.6,
        xmlRootElement: "<RedLightViolation/>",
        metadataAttributes: ["License Plate", "Location"]
    },
    "VehicleOverspeeding": {
        type: DetectionTypes.VehicleOverspeeding,
        confidence: 0.75,
        xmlRootElement: "<VehicleOverspeeding/>",
        metadataAttributes: ["License Plate", "Speed"]
    },
    "UnauthorizedVehicle": {
        type: DetectionTypes.UnauthorizedVehicle,
        confidence: 0.9,
        xmlRootElement: "<UnauthorizedVehicle/>",
        metadataAttributes: ["License Plate", "Location"]
    },
}

// services
const alertService: AlertService = new AlertServiceImpl(alertRepository, alertDetectionRules);
const detectionService: DetectionService = new DetectionServiceImpl(alertService, detectionRepository, frameRepository);

// routers
const routers : {url: string, router: APIRouter}[] = [
    {
        url: '/alert',
        router: new AlertRouter(alertService),
    },
    {   
        url: '/detection',
        router: new DetectionRouter(detectionService),
    },
    {
        url: "/frame",
        router: new FrameRouter(detectionService)
    }
];
for (const router of routers) {
    app.use(router.url, router.router.getRouter());
}

app.get("/", (_, res) => {
    res.send("Success");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
