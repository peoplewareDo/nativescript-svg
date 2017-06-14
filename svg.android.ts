import svg = require("nativescript-svg");
import common = require("./svg.common");
import types = require("tns-core-modules/utils/types");
import * as utilsModule from "tns-core-modules/utils/utils";
import * as fileSystemModule from "tns-core-modules/file-system";
import * as enumsModule from "tns-core-modules/ui/enums";

import dependencyObservable = require("tns-core-modules/ui/core/dependency-observable");
import style = require("tns-core-modules/ui/styling/style");
import view = require("tns-core-modules/ui/core/view");
import background = require("tns-core-modules/ui/styling/background");

import * as httpModule from "tns-core-modules/http";

var http: typeof httpModule;
function ensureHttp() {
    if (!http) {
        http = require("http");
    }
}

global.moduleMerge(common, exports);

var utils: typeof utilsModule;
function ensureUtils() {
    if (!utils) {
        utils = require("utils/utils");
    }
}

var fs: typeof fileSystemModule;
function ensureFS() {
    if (!fs) {
        fs = require("file-system");
    }
}

var enums: typeof enumsModule;
function ensureEnums() {
    if (!enums) {
        enums = require("ui/enums");
    }
}

declare var android: any;
declare var com: any;
declare var java: any;
declare var org: any;

export class ImageSourceSVG implements svg.ImageSourceSVG {
    private nativeView: any;

    public loadFromResource(name: string): boolean {
        this.nativeView = null;

        ensureUtils();

        var res = utils.ad.getApplicationContext().getResources();
        if (res) {
            var identifier: number = res.getIdentifier(name, 'drawable', utils.ad.getApplication().getPackageName());
            if (0 < identifier) {
                // Load SVG
                this.nativeView = new com.larvalabs.svgandroid.SVGParser.getSVGFromResource(res, identifier);
            }
        }

        return this.nativeView != null;
    }

    public fromResource(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromResource(name));
        });
    }

    public loadFromFile(path: string): boolean {
        ensureFS();

        var fileName = types.isString(path) ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }

        this.nativeView = new com.larvalabs.svgandroid.SVGParser.getSVGFromInputStream(new java.io.FileInputStream(new java.io.File(fileName)));
        return this.nativeView != null;
    }

    public fromFile(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromFile(path));
        });
    }

    public loadFromData(data: any): boolean {
        this.nativeView = new com.larvalabs.svgandroid.SVGParser.getSVGFromString(data);
        return this.nativeView != null;
    }

    public fromData(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromData(data));
        });
    }

    public loadFromBase64(source: string): boolean {
        var bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
        this.nativeView = new com.larvalabs.svgandroid.SVGParser.getSVGFromString(new java.lang.String(bytes));
        return this.nativeView != null;
    }


    public fromBase64(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.loadFromBase64(data));
        });
    }

    public loadFromUrl(url: string): boolean {
        ensureHttp();
        var result = http.getString(url);
        return this.setNativeSource(new com.larvalabs.svgandroid.SVGParser.getSVGFromString(result));
        //var httpUrl = new java.net.URL(url);
        //var urlConnection = httpUrl.openConnection();
        //return this.setNativeSource(new com.larvalabs.svgandroid.SVGParser.getSVGFromInputStream(urlConnection.getInputStream()));
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
        // TODO to be implemented
        return false;
    }

    public toBase64String(format: string): string {
        if (!this.nativeView) {
            return null;;
        }

        return android.util.Base64.encodeToString(format, android.util.Base64.DEFAULT);
    }

    get height(): number {
        if (this.nativeView) {
            return this.nativeView.getPitcture().getHeight();
        }

        return NaN;
    }

    get width(): number {
        if (this.nativeView) {
            return this.nativeView.getPitcture().getWidth();
        }

        return NaN;
    }
}

export class SVGImage extends common.SVGImage {
    private _drawable: android.graphics.drawable.PictureDrawable;

    constructor() {
        super();
    }

    public createNativeView() {
        return new org.nativescript.widgets.ImageView(this._context);
    }

    public _setNativeImage(nativeImage: any) {
        this._drawable = nativeImage.nativeView.createPictureDrawable();
        this.nativeView.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
        this.nativeView.setImageDrawable(this._drawable);
    }

    [common.imageSourceProperty.setNative](value: any) {
        var image = <SVGImage>value;

        if (!image || !image.nativeView) {
            return;
        }

        this._setNativeImage(image);
    }
}

// export class ImageStyler implements style.Styler {
//     // Corner radius
//     private static setBorderRadiusProperty(v: view.View, newValue: any, defaultValue?: any) {
//         if (!v._nativeView) {
//             return;
//         }
//         var val = Math.round(newValue * utils.layout.getDisplayDensity());
//         (<org.nativescript.widgets.ImageView>v._nativeView).setCornerRadius(val);
//         background.ad.onBackgroundOrBorderPropertyChanged(v);
//     }

//     private static resetBorderRadiusProperty(v: view.View, nativeValue: any) {
//         if (!v._nativeView) {
//             return;
//         }
//         (<org.nativescript.widgets.ImageView>v._nativeView).setCornerRadius(0);
//         background.ad.onBackgroundOrBorderPropertyChanged(v);
//     }

//     // Border width
//     private static setBorderWidthProperty(v: view.View, newValue: any, defaultValue?: any) {
//         if (!v._nativeView) {
//             return;
//         }

//         var val = Math.round(newValue * utils.layout.getDisplayDensity());
//         (<org.nativescript.widgets.ImageView>v._nativeView).setBorderWidth(val);
//         background.ad.onBackgroundOrBorderPropertyChanged(v);
//     }

//     private static resetBorderWidthProperty(v: view.View, nativeValue: any) {
//         if (!v._nativeView) {
//             return;
//         }
//         (<org.nativescript.widgets.ImageView>v._nativeView).setBorderWidth(0);
//         background.ad.onBackgroundOrBorderPropertyChanged(v);
//     }

//     public static registerHandlers() {
//         // Use the same handler for all background/border properties
//         // Note: There is no default value getter - the default value is handled in background.ad.onBackgroundOrBorderPropertyChanged

//         style.registerHandler(style.borderTopWidthProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderWidthProperty, ImageStyler.resetBorderWidthProperty), "SVGImage");
//         style.registerHandler(style.borderRightWidthProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderWidthProperty, ImageStyler.resetBorderWidthProperty), "SVGImage");
//         style.registerHandler(style.borderBottomWidthProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderWidthProperty, ImageStyler.resetBorderWidthProperty), "SVGImage");
//         style.registerHandler(style.borderLeftWidthProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderWidthProperty, ImageStyler.resetBorderWidthProperty), "SVGImage");

//         style.registerHandler(style.borderTopLeftRadiusProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderRadiusProperty, ImageStyler.resetBorderRadiusProperty), "SVGImage");
//         style.registerHandler(style.borderTopRightRadiusProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderRadiusProperty, ImageStyler.resetBorderRadiusProperty), "SVGImage");
//         style.registerHandler(style.borderBottomRightRadiusProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderRadiusProperty, ImageStyler.resetBorderRadiusProperty), "SVGImage");
//         style.registerHandler(style.borderBottomLeftRadiusProperty, new style.StylePropertyChangedHandler(ImageStyler.setBorderRadiusProperty, ImageStyler.resetBorderRadiusProperty), "SVGImage");


//         // style.registerHandler(style.borderRadiusProperty, new style.StylePropertyChangedHandler(
//         //     ImageStyler.setBorderRadiusProperty,
//         //     ImageStyler.resetBorderRadiusProperty), "SVGImage");

//         // style.registerHandler(style.borderWidthProperty, new style.StylePropertyChangedHandler(
//         //     ImageStyler.setBorderWidthProperty,
//         //     ImageStyler.resetBorderWidthProperty), "SVGImage");
//     }
// }

// ImageStyler.registerHandlers();
