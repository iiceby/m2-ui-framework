export class ExgBaseParamsConfig {
    public static readonly storageKeys = {
        storageTokenKey: 'token',
        storageRefreshTokenKey: 'refresh_token',
        storageLanguage: '__exg_language',
        storageCurrency: '__exg_currency',
        storageIsDebug: '__exg_isdebug',
        storageDebugHttpDelay: '__exg_debughttpdelay',
        storageDebugPopError: '__exg_debugPopError',
        storageStoreConsoleLogging: '__exg_storeconsolelogging',
        storageWelcomeDisplayed: '__exg_welcomeDisplayed',
        storageCookieDisplayed: '__exg_cookieDisplayed',
        storagePageSize: '__bvc_page_size_{0}',
        storageListConfig: '__bvc_list_config_{0}',
    };

    public static readonly geoOptions: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000, // 5min
        timeout: 10 * 1000 // 10sec
    };

    public static readonly auth = {
        accessTokenParamName: 'access_token'
    };

    public static readonly photosUpload = {
        imagesSizeLimitBytes: 10485760
    };

    public static readonly pagination = {
        defaultPageSize: 25
    };
}
