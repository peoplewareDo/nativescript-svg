"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var utils = require("tns-core-modules/utils/utils");
var types = require("tns-core-modules/utils/types");
var definition = require("./svg");
var SRC = "src";
var IMAGE_SOURCE = "imageSource";
var LOAD_MODE = "loadMode";
var SYNC = "sync";
var ASYNC = "async";
var ISLOADING = "isLoading";
exports.srcProperty = new view_1.Property({ name: SRC, defaultValue: undefined, valueChanged: function (target, oldValue, newValue) { return target._createImageSourceFromSrc(); } });
exports.imageSourceProperty = new view_1.Property({ name: IMAGE_SOURCE, defaultValue: undefined });
exports.isLoadingProperty = new view_1.Property({ name: ISLOADING, defaultValue: false });
exports.loadModeProperty = new view_1.Property({ name: LOAD_MODE, defaultValue: SYNC });
var SVGImage = (function (_super) {
    __extends(SVGImage, _super);
    function SVGImage(options) {
        return _super.call(this) || this;
    }
    SVGImage.prototype._createImageSourceFromSrc = function () {
        var _this = this;
        var value = this.src;
        if (types.isString(value)) {
            value = value.trim();
            this.imageSource = null;
            this["_url"] = value;
            this.isLoading = true;
            var source = new definition.ImageSourceSVG();
            var imageLoaded = function () {
                var currentValue = _this.src;
                if (!types.isString(_this.src) || value !== currentValue.trim()) {
                    return;
                }
                _this.imageSource = source;
                _this.isLoading = false;
            };
            if (utils.isDataURI(value)) {
                var base64Data = value.split(",")[1];
                if (types.isDefined(base64Data)) {
                    if (this.loadMode === SYNC) {
                        source.loadFromBase64(base64Data);
                        imageLoaded();
                    }
                    else if (this.loadMode === ASYNC) {
                        source.fromBase64(base64Data).then(imageLoaded);
                    }
                }
            }
            else if (definition.isFileOrResourcePath(value)) {
                if (value.indexOf(utils.RESOURCE_PREFIX) === 0) {
                    var resPath = value.substr(utils.RESOURCE_PREFIX.length);
                    if (this.loadMode === SYNC) {
                        source.loadFromResource(resPath);
                        imageLoaded();
                    }
                    else if (this.loadMode === ASYNC) {
                        this.imageSource = null;
                        source.fromResource(resPath).then(imageLoaded);
                    }
                }
                else {
                    if (this.loadMode === SYNC) {
                        source.loadFromFile(value);
                        imageLoaded();
                    }
                    else if (this.loadMode === ASYNC) {
                        this.imageSource = null;
                        source.fromFile(value).then(imageLoaded);
                    }
                }
            }
            else {
                this.imageSource = null;
                definition.fromUrl(value).then(function (r) {
                    if (_this["_url"] === value) {
                        _this.imageSource = r;
                        _this.isLoading = false;
                    }
                });
            }
        }
        else if (value instanceof definition.ImageSourceSVG) {
            this.imageSource = value;
            this.isLoading = false;
        }
        else {
            this.imageSource = definition.fromNativeSource(value);
            this.isLoading = false;
        }
    };
    return SVGImage;
}(view_1.View));
exports.SVGImage = SVGImage;
function fromResource(name) {
    var image = new definition.ImageSourceSVG();
    return image.loadFromResource(name) ? image : null;
}
exports.fromResource = fromResource;
function fromFile(path) {
    var image = new definition.ImageSourceSVG();
    return image.loadFromFile(path) ? image : null;
}
exports.fromFile = fromFile;
function fromData(data) {
    var image = new definition.ImageSourceSVG();
    return image.loadFromData(data) ? image : null;
}
exports.fromData = fromData;
function fromBase64(source) {
    var image = new definition.ImageSourceSVG();
    return image.loadFromBase64(source) ? image : null;
}
exports.fromBase64 = fromBase64;
function fromNativeSource(source) {
    var image = new definition.ImageSourceSVG();
    return image.setNativeSource(source) ? image : null;
}
exports.fromNativeSource = fromNativeSource;
function fromUrl(url) {
    var image = new definition.ImageSourceSVG();
    return image.loadFromUrl(url) ? image : null;
}
exports.fromUrl = fromUrl;
function fromFileOrResource(path) {
    if (!isFileOrResourcePath(path)) {
        throw new Error("Path \"" + "\" is not a valid file or resource.");
    }
    if (path.indexOf(utils.RESOURCE_PREFIX) === 0) {
        return fromResource(path.substr(utils.RESOURCE_PREFIX.length));
    }
    return fromFile(path);
}
exports.fromFileOrResource = fromFileOrResource;
function isFileOrResourcePath(path) {
    return utils.isFileOrResourcePath(path);
}
exports.isFileOrResourcePath = isFileOrResourcePath;
exports.srcProperty.register(SVGImage);
exports.imageSourceProperty.register(SVGImage);
exports.loadModeProperty.register(SVGImage);
exports.isLoadingProperty.register(SVGImage);
