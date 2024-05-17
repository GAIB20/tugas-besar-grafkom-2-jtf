export const ZERO_TOLERANCE = 1e-10;
export const DEG2RAD = Math.PI / 180;
export function wrapAngle(angle: number, range: number = Math.PI * 2): number {
    return ((angle % range) + range) % range;
}
