import encodeUrl from 'encodeurl';

export class UrlUtils {
    public static appendQueryParams(url: string, paramName: string, paramValue: string): string {
        if (url && url.startsWith('http')) {
            const urlObj = new URL(url);
            urlObj.searchParams.append(paramName, paramValue);
            return urlObj.toString();
        }
        return url;
    }

    public static encodeUrl(url: string): string {
        return encodeUrl(url);
    }

    public static trimUrl(url: string, trimSocial?: string[]) {
        if (!url || url.length < 1) {
            return null;
        }

        let newUrl = url;
        ['https://www.', 'http://www.', 'https://', 'http://'].forEach((element) => {
            newUrl = newUrl.replace(element, '');
        });

        if (newUrl.endsWith('/')) {
            newUrl = newUrl.substr(0, newUrl.length - 1);
        }

        if (trimSocial) {
            trimSocial.forEach((element) => {
                newUrl = newUrl.replace(`${element}/`, '');
            });
        }

        return newUrl;
    }

    public static appendUrl(url: string, social?: string[]) {
        if (!url || url.length < 1) {
            return null;
        }

        const started = ['https://', 'http://', 'https://www', 'http://www'].some(x => url.startsWith(x));
        if (started) {
            return url;
        }

        if (social) {
            const started = social.some(x => url.startsWith(x));
            if (!started) {
                return `https://${social[0]}/${url}`;
            }
        }

        return `https://${url}`;
    }
}
