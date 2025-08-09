export class GeocodingUtils {

    public static getAddressUid(address: any): any {
        return address && address.id
            ? address.id
            : address && address.placeId
                ? address.placeId
                : null;
    }
}
