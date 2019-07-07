import Point from './Point';

export default interface Rectangle {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
}

export const addPointToRectangle = (rect: Rectangle, point: Point): void => {
    Object.keys(rect).forEach((key: string) => {
        (rect[key] as Point).x += point.x;
        (rect[key] as Point).y += point.y;
    });
};
