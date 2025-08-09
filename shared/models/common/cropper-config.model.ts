import { OutputFormat } from "ngx-image-cropper";

export interface ICropperConfig {
    title: string;
    subtitle: string;
    imageSize: number;
    imageHeight: number;
    keepAspectRatio: boolean;
    aspectRatio: number;
    allowUpScale: boolean;
    format?: OutputFormat;
}
