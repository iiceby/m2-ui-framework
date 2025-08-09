export interface ISharedSettingsConfig {
    environment: any;
    version: any;
    authSettings: IAuthSettings;
}

export interface IAuthSettings {
    logoWidth: string;
    logoHeight: string;
}

export class DefaultAuthSettings implements IAuthSettings {
    logoWidth: '8.7rem';
    logoHeight: '3rem';
}
