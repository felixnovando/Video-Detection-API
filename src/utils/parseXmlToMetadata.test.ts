import { parseXmlToMetadata } from './parseXmlToMetadata';

test("parse xml to metadata", () => {
    const xml = "<RedLightViolation licensePlate=\"B1234XYZ\" location=\"Junction 5\" />";
    const expectedMetadata: Record<string, string> = {
        "root": "<RedLightViolation/>",
        "licensePlate": "B1234XYZ",
        "location": "Junction 5"
    };
    expect(parseXmlToMetadata(xml)).toMatchObject(expectedMetadata);
});