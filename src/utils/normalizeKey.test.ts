import { normalizeKey } from "./normalizeKey";

test('normalize key', () => {
    const key = "License Plate";
    const expectedResult = "licenseplate";
    
    expect(normalizeKey(key)).toEqual(expectedResult);
});