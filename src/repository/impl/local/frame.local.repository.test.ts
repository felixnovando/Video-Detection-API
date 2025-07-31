import { FrameRepositoryLocal } from "./frame.local.repository";
import { FrameRepository } from "../../api/frame.repository.api";
import { Frame } from "../../../models";

describe("FrameRepositoryLocal - with preloaded frame", () => {
    let repository: FrameRepository;
    const SAMPLE_ID = "frame-001";

    beforeEach(() => {
        const frames = [
            {
                id: SAMPLE_ID,
                timestamp: "2025-07-07T14:20:30Z",
                url: "/mnt/storage/test1.jpg",
                width: 500,
                height: 500,
            },
            {
                id: "frame-002",
                timestamp: "2025-07-07T14:20:33Z",
                url: "/mnt/storage/test2.jpg",
                width: 640,
                height: 480,
            },
            {
                id: "frame-003",
                timestamp: "2025-07-07T14:20:36Z",
                url: "/mnt/storage/test3.jpg",
                width: 1280,
                height: 720,
            }
        ];
        const localData = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };
        for(const frame of frames) {
            localData.frames.set(frame.id, frame);
        }
        repository = new FrameRepositoryLocal(localData);
    });

    it("should return all frames in repository", async () => {
        const frames = await repository.getAllFrames();
        expect(frames.length).toBe(3);
    });

    it("should return a frame when fetched by existing ID", async () => {
        const frame = await repository.getFrame(SAMPLE_ID);
        expect(frame).not.toBeNull();
    });
});

describe("FrameRepositoryLocal - empty data", () => {
    let repository: FrameRepository;

    const SAMPLE_ID = "frame-001";

    beforeEach(() => {
        const EMPTY_DATA = {
            frames: new Map(),
            alerts: new Map(),
            detections: new Map()
        };
        repository = new FrameRepositoryLocal(EMPTY_DATA);
    });

    it("should return null when fetching non-existent frame", async () => {
        const frame = await repository.getFrame(SAMPLE_ID);
        expect(frame).toBeNull();
    });

    it("should insert a frame and return it as-is", async () => {
        const inputFrame: Frame = {   
            id: SAMPLE_ID,
            timestamp: "2025-07-07T14:20:30Z",
            url: "/mnt/storage/test1.jpg",
            width: 500,
            height: 500,
        };
        const insertedFrame = await repository.insertFrame(inputFrame);
        expect(insertedFrame).toStrictEqual(inputFrame);
    });
});