export const ZERO_TOLERANCE = 1e-10;
export const DEG2RAD = Math.PI / 180;
export function wrapAngle(angle: number): number {
    angle = angle % 360;
    if (angle < 0) angle += 360;
    return angle;
}
