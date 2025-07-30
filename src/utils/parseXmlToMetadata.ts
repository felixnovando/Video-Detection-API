import { DOMParser } from 'xmldom';
import { KEYS } from '../types';

export function parseXmlToMetadata(metadata: string): Record<string, string> {
    const result: Record<string, string> = {};
    const parser = new DOMParser();
    
    const root = parser.parseFromString(metadata, "application/xml").documentElement;
    result[KEYS.ROOT] = `<${root.nodeName}/>`;

    for (let i = 0; i < root.attributes.length; i++) {
        const attribute = root.attributes[i];
        result[attribute.name] = attribute.value;
    };
    return result;
}