export class ImageUtils {
    //@ts-ignore
    public static async getImageSize(imageData): Promise<{ width: number; height: number }> {
        return new Promise<any>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = err => reject(err);
            img.src = imageData;
        });
    }

    public static async downloadImageAsBase64(imgUrl: string): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                //@ts-ignore
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
                // alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            };
            img.onerror = err => {
                reject(err);
            };
            img.src = imgUrl;
        });
    }
    //@ts-ignore
    public static async readImageFromFileAsDataUrl(file, ext = ['jpg', 'gif', 'png', 'jpeg']): Promise<any> {
        return ImageUtils.readImageFromFile(false, file, ext);
    }
    //@ts-ignore
    public static async readImageFromFileAsArrayBuffer(file, ext = ['jpg', 'gif', 'png', 'jpeg']): Promise<any> {
        return ImageUtils.readImageFromFile(true, file, ext);
    }
    //@ts-ignore
    private static async readImageFromFile(asBuffer: boolean, file, ext = ['jpg', 'gif', 'png', 'jpeg']): Promise<any> {
        if (!file) {
            return Promise.resolve('file not specified');
        }
        return new Promise<any>((resolve, reject) => {
            try {
                const arr = file.name.toLocaleLowerCase().split('.');
                if (ext.indexOf(arr[arr.length - 1]) > -1) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => resolve(reader.result));
                    reader.addEventListener('error', err => reject(err || reader.error));
                    // reader.addEventListener('abort', () => resolve(null));
                    if (asBuffer) {
                        reader.readAsArrayBuffer(file);
                    } else {
                        reader.readAsDataURL(file);
                    }
                } else {
                    reject('Only images allowed');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
