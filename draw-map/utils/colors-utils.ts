export class ColorsUtils {
    private static _colorConfig = [
        '#F44336', '#02A4DA', '#AD2C99', '#18C272', '#6241B3', '#C37F18', '#D02586', '#08A8C4', '#2577D0', '#906842',
        '#00c853', '#64dd17', '#ffd600', '#ffab00', '#ff6d00', '#dd2c00', '#f50057', '#17ffff',
        '#b2ff5a', '#ff9201', '#ff3d00', '#eb80fd', '#69f0ae', '#ff9e81', '#ff4081', '#f800ff',
        '#8e7148', '#663131', '#06a47c', '#aa3d96', '#6f6f6f', '#1f1f1f', '#258f89', '#01e5ff',
        '#d50001', '#c51062', '#aa01ff', '#6201ea', '#3050fe', '#0091ea', '#00b8d4', '#00bfa5'
    ];

    public static getColor(index: number): string {
        if (index > ColorsUtils._colorConfig.length - 1) {
            return ColorsUtils._colorConfig[0];
        }

        return ColorsUtils._colorConfig[index];
    }
}
