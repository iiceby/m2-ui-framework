export class JwtUtils {
    public static decode<T>(token: string): T {
        // @ts-ignore
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
         // @ts-ignore
        const atob = require('atob');
        return <T>JSON.parse(atob(base64));
    }
}