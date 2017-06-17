import { View, Property } from "tns-core-modules/ui/core/view";
import * as utils from "tns-core-modules/utils/utils";
import * as types from "tns-core-modules/utils/types"

// This is used for definition purposes only, it does not generate JavaScript for it.
import * as definition from "./svg";

var SRC = "src";
var IMAGE_SOURCE = "imageSource";
var LOAD_MODE = "loadMode";
var SYNC = "sync";
var ASYNC = "async";
var ISLOADING = "isLoading";

export const srcProperty = new Property<SVGImage, boolean>({ name: SRC, defaultValue: undefined, valueChanged: (target, oldValue, newValue) => target._createImageSourceFromSrc() });
export const imageSourceProperty = new Property<SVGImage, definition.ImageSourceSVG>({ name: IMAGE_SOURCE, defaultValue: undefined });
export const isLoadingProperty = new Property<SVGImage, boolean>({ name: ISLOADING, defaultValue: false });
export const loadModeProperty = new Property<SVGImage, string>({ name: LOAD_MODE, defaultValue: SYNC });

export class SVGImage extends View implements definition.SVGImage {
    src: any;
    imageSource: definition.ImageSourceSVG;
    isLoading: boolean;
    loadMode: "sync" | "async";

    constructor(options?: definition.Options) {
        // super(options);
        super();
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

            // this._setValue(SVGImage.isLoadingProperty, true);
            this.isLoading = true;

            var source = new definition.ImageSourceSVG();
            var imageLoaded = () => {
                let currentValue = this.src;
                if (!types.isString(this.src) || value !== currentValue.trim()) {
                    return;
                }
                this.imageSource = source;
                // imageSourceProperty.nativeValueChange(this, source);
                // this._setValue(SVGImage.isLoadingProperty, false);
                this.isLoading = false;
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
                        // this._setValue(SVGImage.isLoadingProperty, false);
                        this.isLoading = false;
                    }
                });
            }
        }
        else if (value instanceof definition.ImageSourceSVG) {
            // Support binding the imageSource trough the src property
            this.imageSource = value;
            // this._setValue(SVGImage.isLoadingProperty, false);
            this.isLoading = false;

        }
        else {
            this.imageSource = definition.fromNativeSource(value);
            // this._setValue(SVGImage.isLoadingProperty, false);
            this.isLoading = false;
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

srcProperty.register(SVGImage);
imageSourceProperty.register(SVGImage);
loadModeProperty.register(SVGImage);
isLoadingProperty.register(SVGImage);