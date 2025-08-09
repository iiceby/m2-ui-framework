import generator from 'generate-password-browser';

export class PasswordUtils {
    public static generatePassword(length: number = 12): string {
        return generator.generate({
            length,
            numbers: true
        });
    }
}
