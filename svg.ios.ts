import svg = require("nativescript-svg");
import common = require("./svg.common");
import types = require("utils/types");
import fs = require("file-system");

global.moduleMerge(common, exports);

export class ImageSourceSVG implements svg.ImageSourceSVG {
    public android: com.larvalabs.svgandroid.SVG;
    public ios: SVGKImage;

    public loadFromResource(name: string): boolean {
        this.ios = SVGKImage.imageNamed(name) || SVGKImage.imageNamed(`${name}.svg`);
        return this.ios != null;
    }

    public fromResource(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                (<any>SVGKImage).imageAsynchronouslyNamed(name, (image, parseResult) => {
                    if (image) {
                        this.ios = image;
                        resolve(true);
                    } else {
                        (<any>SVGKImage).imageAsynchronouslyNamed(`${name}.svg`, (image, parseResult) => {
                            this.ios = image;
                            resolve(true);
                        });
                    }
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromFile(path: string): boolean {
        var fileName = types.isString(path) ? path.trim() : "";

        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }

        this.ios = SVGKImage.imageWithContentsOfFile(fileName);
        return this.ios != null;
    }

    public fromFile(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                var fileName = types.isString(path) ? path.trim() : "";

                if (fileName.indexOf("~/") === 0) {
                    fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
                }

                (<any>SVGKImage).imageWithContentsOfFileAsynchronously(fileName, image => {
                    this.ios = image;
                    resolve(true);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromData(data: any): boolean {
        this.ios = SVGKImage.imageWithData(data);
        return this.ios != null;
    }

    public fromData(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                (<any>SVGKImage).imageWithDataAsynchronously(data, image => {
                    this.ios = image;
                    resolve(true);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromBase64(source: string): boolean {
        if (types.isString(source)) {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
            this.ios = SVGKImage.imageWithData(data);
        }
        return this.ios != null;
    }


    public fromBase64(source: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
                SVGKImage.imageWithDataAsynchronously(data, image => {
                    this.ios = image;
                    resolve(true);
                });

            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromUrl(url: string): boolean {
        this.ios = SVGKImage.imageWithContentsOfURL(NSURL.urlWithString(url));

        return this.ios != null;
    }
    
    public fromUrl(url:string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromUrl(url));
        });        
    }    

    public setNativeSource(source: any): boolean {
        this.ios = source;
        return source != null;
    }

    public saveToFile(path: string): boolean {
        if (!this.ios) {
            return false;
        }

        var data = getImageData(this.ios);

        if (data) {
            return data.writeToFileAtomically(path, true);
        }

        return false;
    }

    public toBase64String(format: string): string {
        var res = null;
        if (!this.ios) {
            return res;
        }

        var data = getImageData(this.ios);

        if (data) {
            res = data.base64EncodedStringWithOptions(NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
        }

        return res;

    }

    get height(): number {
        if (this.ios) {
            return this.ios.size.height;
        }

        return NaN;
    }

    get width(): number {
        if (this.ios) {
            return this.ios.size.width;
        }

        return NaN;
    }
}

function getImageData(instance: SVGKImage): NSData {
    var buffer = instance.source.stream;
    return NSData.alloc().initWithBytes(buffer, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
}
