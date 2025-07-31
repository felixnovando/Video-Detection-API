import { DetectionBox } from "../models";
import { checkBoundingBoxOverlap } from "./checkBoundingBoxOverlap";

describe("Check Bounding Box Overlap" , () => {

    test("non overlapping box", () => {
        const box1: DetectionBox = {
            left: 0.1,
            top: 0.1,
            width: 0.3,
            height: 0.3
        };
        const box2: DetectionBox = {
            left: 0.6,
            top: 0.6,
            width: 0.2,
            height: 0.2
        };
        expect(checkBoundingBoxOverlap(box1, box2)).toEqual(false);
    });

    test("overlapping box", () => {
        const box1: DetectionBox = {
            left: 0.1,
            top: 0.1,
            width: 0.4,
            height: 0.4
        };
        const box2: DetectionBox = {
            left: 0.3,
            top: 0.3,
            width: 0.4,
            height: 0.4
        };
        expect(checkBoundingBoxOverlap(box1, box2)).toEqual(true);
    });

});