import svg = require("nativescript-svg");
import common = require("./svg.common");
import types = require("utils/types");
import fs = require("file-system");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import enums = require("ui/enums");

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
        this.ios = SVGKImage.imageWithContentsOfURL(NSURL.URLWithString(url));

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
    var buffer = instance.source.stream; //TODO fix issue, wrong type
    return NSData.alloc().initWithBytes(buffer, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
}

function onImageSourcePropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var image = <SVGImage>data.object;
    image._setNativeImage(data.newValue ? data.newValue.ios : null);
}

// register the setNativeValue callback
(<proxy.PropertyMetadata>common.SVGImage.imageSourceProperty.metadata).onSetNativeValue = onImageSourcePropertyChanged;

export class SVGImage extends common.SVGImage {
    private _ios: SVGKFastImageView;
    private _imageSourceAffectsLayout: boolean = true;

    constructor() {
        super();

        //TODO: Think of unified way of setting all the default values.
        this._ios = new SVGKFastImageView();
        //this._ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        //this._ios.clipsToBounds = true;
        //this._ios.userInteractionEnabled = true;
    }

    get ios(): SVGKFastImageView {
        return this._ios;
    }

    public _setNativeImage(nativeImage: any) {
        this.ios.image = nativeImage;

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

        var measureWidth = Math.max(nativeWidth, this.minWidth);
        var measureHeight = Math.max(nativeHeight, this.minHeight);

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

} 