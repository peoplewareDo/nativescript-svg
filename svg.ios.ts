import svg = require("svg");
import types = require("utils/types");
import fs = require("file-system");
import common = require("./image-source-common");


global.moduleMerge(common, exports);

export class ImageSourceSVG implements svg.ImageSourceSVG {
    public android: com.larvalabs.svgandroid.SVG;
    public ios: SVGKImage;


    public loadFromResource(name: string): boolean {
        this.ios = SVGKImage.imageNamed(name) || SVGKImage.imageNamed(`${name}.svg`);
        return this.ios != null;
    }

    public loadFromFile(path: string): boolean {
        var fileName = types.isString(path) ? path.trim() : "";

        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }

        this.ios = SVGKImage.imageWithContentsOfFile(fileName);
        return this.ios != null;
    }

    public loadFromData(data: any): boolean {
        this.ios = SVGKImage.imageWithData(data);
        return this.ios != null;
    }

    public loadFromBase64(source: string): boolean {
        if (types.isString(source)) {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
            this.ios = SVGKImage.imageWithData(data);
        }
        return this.ios != null;
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
