import dependencyObservable = require("ui/core/dependency-observable");
import view = require("ui/core/view");
import proxy = require("ui/core/proxy");
import enums = require("ui/enums");
import platform = require("platform");
import utils = require("utils/utils");
import * as types from "utils/types";

// This is used for definition purposes only, it does not generate JavaScript for it.
import definition = require("nativescript-svg");

var SRC = "src";
var IMAGE_SOURCE = "imageSourceSVG";
var LOAD_MODE = "loadMode";

var SYNC = "sync";
var ASYNC = "async";

var IMAGE = "SVGImage";
var ISLOADING = "isLoading";

// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
var AffectsLayout = platform.device.os === platform.platformNames.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;

function onSrcPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var image = <SVGImage>data.object;
    // Check for delay...
    image._createImageSourceFromSrc();
}

export class SVGImage extends view.View implements definition.SVGImage {

    /**
     * Gets the native [android widget](http://developer.android.com/reference/android/widget/ImageView.html) that represents the user interface for this component. Valid only when running on Android OS.
    */
    android: any /* android.widget.ImageView */;

    /**
     * Gets the native iOS [UIImageView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImageView_Class/) that represents the user interface for this component. Valid only when running on iOS.
     */
    ios: any /* UIImageView */;

    public static srcProperty = new dependencyObservable.Property(SRC, IMAGE,
        new dependencyObservable.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onSrcPropertyChanged));

    // None on purpose. for iOS we trigger it manually if needed. Android layout handles it.
    public static imageSourceProperty = new dependencyObservable.Property(IMAGE_SOURCE, IMAGE,
        new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));

    public static isLoadingProperty = new dependencyObservable.Property(ISLOADING, IMAGE,
        new dependencyObservable.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));

    public static loadModeProperty = new dependencyObservable.Property(LOAD_MODE, IMAGE,
        new proxy.PropertyMetadata(SYNC, 0, null, (value) => value === SYNC || value === ASYNC, null));

    constructor(options?: definition.Options) {
        super(options);
    }

    get src(): any {
        return this._getValue(SVGImage.srcProperty);
    }
    set src(value: any) {
        this._setValue(SVGImage.srcProperty, value);
    }

    get imageSource(): definition.ImageSourceSVG {
        return this._getValue(SVGImage.imageSourceProperty);
    }
    set imageSource(value: definition.ImageSourceSVG) {
        this._setValue(SVGImage.imageSourceProperty, value);
    }

    get isLoading(): boolean {
        return this._getValue(SVGImage.isLoadingProperty);
    }

    get loadMode(): "sync" | "async" {
        return this._getValue(SVGImage.loadModeProperty);
    }
    set loadMode(value: "sync" | "async") {
        this._setValue(SVGImage.loadModeProperty, value);
    }

    public _setNativeImage(nativeImage: any) {
        //
    }

    /**
     * @internal
     */
    _createImageSourceFromSrc(): void {
        var value = this.src;
        if (types.isString(value)) {
            value = value.trim();
            this.imageSource = null;
            this["_url"] = value;

            this._setValue(SVGImage.isLoadingProperty, true);

            var source = new definition.ImageSourceSVG();
            var imageLoaded = () => {
                let currentValue = this.src;
                if (!types.isString(this.src) || value !== currentValue.trim()) {
                    return;
                }
                this.imageSource = source;
                this._setValue(SVGImage.isLoadingProperty, false);
            }
            //WRONG IMplementation, it can't load data uri, just base xml encode
            if (utils.isDataURI(value)) {
                var base64Data = value.split(",")[1];
                if (types.isDefined(base64Data)) {
                    if (this.loadMode === SYNC) {
                        source.loadFromBase64(base64Data);
                        imageLoaded();
                    } else if (this.loadMode === ASYNC) {
                        source.fromBase64(base64Data).then(imageLoaded);
                    }
                }
            }
            else if (definition.isFileOrResourcePath(value)) {
                if (value.indexOf(utils.RESOURCE_PREFIX) === 0) {
                    let resPath = value.substr(utils.RESOURCE_PREFIX.length);
                    if (this.loadMode === SYNC) {
                        source.loadFromResource(resPath);
                        imageLoaded();
                    } else if (this.loadMode === ASYNC) {
                        this.imageSource = null;
                        source.fromResource(resPath).then(imageLoaded);
                    }
                } else {
                    if (this.loadMode === SYNC) {
                        source.loadFromFile(value);
                        imageLoaded();
                    } else if (this.loadMode === ASYNC) {
                        this.imageSource = null;
                        source.fromFile(value).then(imageLoaded);
                    }
                }
            } else {
                this.imageSource = null;
                definition.fromUrl(value).then((r) => {
                    if (this["_url"] === value) {
                        this.imageSource = r;
                        this._setValue(SVGImage.isLoadingProperty, false);
                    }
                });
            }
        }
        else if (value instanceof definition.ImageSourceSVG) {
            // Support binding the imageSource trough the src property
            this.imageSource = value;
            this._setValue(SVGImage.isLoadingProperty, false);
        }
        else {
            this.imageSource = definition.fromNativeSource(value);
            this._setValue(SVGImage.isLoadingProperty, false);
        }
    }

}

export function fromResource(name: string): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.loadFromResource(name) ? image : null;
}

export function fromFile(path: string): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.loadFromFile(path) ? image : null;
}

export function fromData(data: any): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.loadFromData(data) ? image : null;
}

export function fromBase64(source: string): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.loadFromBase64(source) ? image : null;
}

export function fromNativeSource(source: any): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.setNativeSource(source) ? image : null;
}

export function fromUrl(url: string): definition.ImageSourceSVG {
    var image = new definition.ImageSourceSVG();
    return image.loadFromUrl(url) ? image : null;
}

export function fromFileOrResource(path: string): definition.ImageSourceSVG {
    if (!isFileOrResourcePath(path)) {
        throw new Error("Path \"" + "\" is not a valid file or resource.");
    }

    if (path.indexOf(utils.RESOURCE_PREFIX) === 0) {
        return fromResource(path.substr(utils.RESOURCE_PREFIX.length));
    }
    return fromFile(path);
}

export function isFileOrResourcePath(path: string): boolean {
    return utils.isFileOrResourcePath(path);
}