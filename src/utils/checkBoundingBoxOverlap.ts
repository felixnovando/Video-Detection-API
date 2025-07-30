import { DetectionBox } from "../models";

export function checkBoundingBoxOverlap(box1: DetectionBox, box2: DetectionBox): boolean {
    const box1Right = box1.left + box1.width;
    const box1Bottom = box1.top + box1.height;
    const box2Right = box2.left + box2.width;
    const box2Bottom = box2.top + box2.height;

    const noOverlap = box1Right <= box2.left ||
        box1.left >= box2Right || 
        box1Bottom <= box2.top
        box1.top >= box2Bottom;

    return !noOverlap;
}