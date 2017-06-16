import svg = require("nativescript-svg");
import common = require("./svg.common");
import types = require("tns-core-modules/utils/types");
import fs = require("tns-core-modules/file-system");
import dependencyObservable = require("tns-core-modules/ui/core/dependency-observable");
import enums = require("tns-core-modules/ui/enums");

global.moduleMerge(common, exports);
declare var SVGKImage: any;

export class ImageSourceSVG implements svg.ImageSourceSVG {
    private nativeView: any;

    public loadFromResource(name: string): boolean {
        this.nativeView = SVGKImage.imageNamed(name) || SVGKImage.imageNamed(`${name}.svg`);
        return this.nativeView != null;
    }

    public fromResource(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                (<any>SVGKImage).imageAsynchronouslyNamed(name, (image, parseResult) => {
                    if (image) {
                        this.nativeView = image;
                        resolve(true);
                    } else {
                        (<any>SVGKImage).imageAsynchronouslyNamed(`${name}.svg`, (image, parseResult) => {
                            this.nativeView = image;
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

        this.nativeView = SVGKImage.imageWithContentsOfFile(fileName);
        return this.nativeView != null;
    }

    public fromFile(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                var fileName = types.isString(path) ? path.trim() : "";

                if (fileName.indexOf("~/") === 0) {
                    fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
                }

                (<any>SVGKImage).imageWithContentsOfFileAsynchronously(fileName, image => {
                    this.nativeView = image;
                    resolve(true);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromData(data: any): boolean {
        this.nativeView = SVGKImage.imageWithData(data);
        return this.nativeView != null;
    }

    public fromData(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                (<any>SVGKImage).imageWithDataAsynchronously(data, image => {
                    this.nativeView = image;
                    resolve(true);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromBase64(source: string): boolean {
        if (types.isString(source)) {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.IgnoreUnknownCharacters);
            this.nativeView = SVGKImage.imageWithData(data);
        }
        return this.nativeView != null;
    }


    public fromBase64(source: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.IgnoreUnknownCharacters);
                SVGKImage.imageWithDataAsynchronously(data, image => {
                    this.nativeView = image;
                    resolve(true);
                });

            } catch (ex) {
                reject(ex);
            }
        });
    }

    public loadFromUrl(url: string): boolean {
        this.nativeView = SVGKImage.imageWithContentsOfURL(NSURL.URLWithString(url));

        return this.nativeView != null;
    }

    public fromUrl(url: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromUrl(url));
        });
    }

    public setNativeSource(source: any): boolean {
        this.nativeView = source;
        return source != null;
    }

    public saveToFile(path: string): boolean {
        if (!this.nativeView) {
            return false;
        }

        var data = getImageData(this.nativeView);

        if (data) {
            return data.writeToFileAtomically(path, true);
        }

        return false;
    }

    public toBase64String(format: string): string {
        var res = null;
        if (!this.nativeView) {
            return res;
        }

        var data = getImageData(this.nativeView);

        if (data) {
            res = data.base64EncodedStringWithOptions(NSDataBase64EncodingOptions.Encoding64CharacterLineLength);
        }

        return res;

    }

    get height(): number {
        if (this.nativeView) {
            return this.nativeView.size.height;
        }

        return NaN;
    }

    get width(): number {
        if (this.nativeView) {
            return this.nativeView.size.width;
        }

        return NaN;
    }
}

function getImageData(instance: any): NSData {
    var buffer = instance.source.stream;
    //TODO fix issue, wrong type
    throw new Error("Not supported operation");
    // return NSData.alloc().initWithBytes(buffer, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
}

declare var SVGKFastImageView: any;

export class SVGImage extends common.SVGImage {
    private _imageSourceAffectsLayout: boolean = true;

    constructor() {
        super();

        //TODO: Think of unified way of setting all the default values.
        this.nativeView = SVGKFastImageView.alloc().initWithSVGKImage(new SVGKImage());
        //this._ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        //this._ios.clipsToBounds = true;
        //this._ios.userInteractionEnabled = true;
    }

    public _setNativeImage(nativeImage: any) {
        this.nativeView.image = nativeImage.nativeView;

        if (this._imageSourceAffectsLayout) {
            this.requestLayout();
        }
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        var utils = require("utils/utils");

        // We don't call super because we measure native view with specific size.     
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);

        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);

        var nativeWidth = this.imageSource ? this.imageSource.width : 0;
        var nativeHeight = this.imageSource ? this.imageSource.height : 0;

        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);

        var finiteWidth: boolean = widthMode !== utils.layout.UNSPECIFIED;
        var finiteHeight: boolean = heightMode !== utils.layout.UNSPECIFIED;

        this._imageSourceAffectsLayout = widthMode !== utils.layout.EXACTLY || heightMode !== utils.layout.EXACTLY;

        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var resultW = nativeWidth;
            var resultH = nativeHeight;

            measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
            measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;

            var trace = require("trace");

            if (trace.enabled) {
                trace.write("nativeWidth: " + nativeWidth + ", nativeHeight: " + nativeHeight, trace.categories.Layout);
            }
        }

        var view = require("ui/core/view");

        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);

        this.setMeasuredDimension(widthAndState, heightAndState);
    }

    [common.imageSourceProperty.setNative](value: any) {
        var image = <SVGImage>value;

        if (!image || !image.nativeView) {
            return;
        }

        this._setNativeImage(image);
    }
} 