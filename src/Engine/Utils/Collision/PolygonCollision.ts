import Point from '../Point';

function isUndefined(toCheck: unknown): boolean {
    return typeof toCheck === 'undefined';
}

/**
 * Credit to: https://stackoverflow.com/questions/24970416/detect-if-two-rotated-divs-collide-using-jquery/25045139
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem.
 * Only works on convex polygons
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
export const doPolygonsIntersect = (a: Point[], b: Point[]): boolean => {
    const polygons = [a, b];
    let minA: number;
    let maxA: number;
    let projected: number;
    let minB: number;
    let maxB: number;

    for (let i = 0; i < polygons.length; i++) {
        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        const polygon = polygons[i];
        for (let i1 = 0; i1 < polygon.length; i1++) {
            // grab 2 vertices to create an edge
            const i2 = (i1 + 1) % polygon.length;
            const p1 = polygon[i1];
            const p2 = polygon[i2];

            // find the line perpendicular to this edge
            const normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (let j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (let j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // CONSOLE("polygons don't intersect!");
                return false;
            }
        }
    }

    return true;
};
