export default interface Point {
    x: number;
    y: number;
}

export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
    return {
        x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
        y: Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y,
    };
};
