export class PolygonOverlapsUtils {
    public static overlaps(firstPolygon: [], secondPolygone: []): boolean {
        if (PolygonOverlapsUtils.polygonPointsInside(firstPolygon, secondPolygone)) {
            return true;
        }

        if (PolygonOverlapsUtils.polygonEdgesOverlap(firstPolygon, secondPolygone)) {
            return true;
        }

        return false;
    }

    private static polygonPointsInside(firstPolygon, secondPolygone) {
        let i;
        for (i = 0; i < firstPolygon.length; i += 1) {
            if (PolygonOverlapsUtils.inside(firstPolygon[i], secondPolygone)) {
                return true;
            }
        }
        for (i = 0; i < secondPolygone.length; i += 1) {
            if (PolygonOverlapsUtils.inside(secondPolygone[i], firstPolygon)) {
                return true;
            }
        }
        return false;
    }

    private static polygonEdgesOverlap(firstPolygon, secondPolygone) {
        for (let i = 0; i < firstPolygon.length - 1; i += 1) {
            for (let j = 0; j < secondPolygone.length - 1; j += 1) {
                if (PolygonOverlapsUtils.intersect(firstPolygon[i][0], firstPolygon[i][1], firstPolygon[i + 1][0], firstPolygon[i + 1][1],
                        secondPolygone[j][0], secondPolygone[j][1], secondPolygone[j + 1][0], secondPolygone[j + 1][1])) {
                    return true;
                }
            }
        }
        return false;
    }

    private static inside(p, poly) {
        let c = false;
        const nvert = poly.length;
        for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
            if (((poly[i][1] > p[1]) !== (poly[j][1] > p[1])) &&
                (p[0] < (poly[j][0] - poly[i][0]) * (p[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])) {
                    c = !c;
                }
        }

        return c;
    }

    private static onSegment(xi, yi, xj, yj, xk, yk) {
        return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) &&
            (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
    }

    private static dir(xi, yi, xj, yj, xk, yk) {
        const a = (xk - xi) * (yj - yi);
        const b = (xj - xi) * (yk - yi);
        return a < b ? -1 : a > b ? 1 : 0;
    }

    private static intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        const d1 = PolygonOverlapsUtils.dir(x3, y3, x4, y4, x1, y1);
        const d2 = PolygonOverlapsUtils.dir(x3, y3, x4, y4, x2, y2);
        const d3 = PolygonOverlapsUtils.dir(x1, y1, x2, y2, x3, y3);
        const d4 = PolygonOverlapsUtils.dir(x1, y1, x2, y2, x4, y4);
        return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
                ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
                 (d1 === 0 && PolygonOverlapsUtils.onSegment(x3, y3, x4, y4, x1, y1)) ||
                 (d2 === 0 && PolygonOverlapsUtils.onSegment(x3, y3, x4, y4, x2, y2)) ||
                 (d3 === 0 && PolygonOverlapsUtils.onSegment(x1, y1, x2, y2, x3, y3)) ||
                 (d4 === 0 && PolygonOverlapsUtils.onSegment(x1, y1, x2, y2, x4, y4));
    }
}
