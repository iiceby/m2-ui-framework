export class ColorUtils {

    private static colors = ['#f1f2f7', '#4a3a2f', '#1f2024'];

    public static getColorHash(colorId: number): string {
        return ColorUtils.colors[colorId];
    }
}
