export class GuidUtils {

    public static get newGuid(): string { return require('uuid').v4(); }

    public static isGuid(id: string): boolean {
        return id.length === 36;
    }
}
