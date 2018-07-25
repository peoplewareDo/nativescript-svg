"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./svg.common");
var types = require("tns-core-modules/utils/types");
var fs = require("tns-core-modules/file-system");
global.moduleMerge(common, exports);
var ImageSourceSVG = (function () {
    function ImageSourceSVG() {
    }
    ImageSourceSVG.prototype.loadFromResource = function (name) {
        this.nativeView = SVGKImage.imageNamed(name) || SVGKImage.imageNamed(name + ".svg");
        return this.nativeView != null;
    };
    ImageSourceSVG.prototype.fromResource = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                SVGKImage.imageAsynchronouslyNamed(name, function (image, parseResult) {
                    if (image) {
                        _this.nativeView = image;
                        resolve(true);
                    }
                    else {
                        SVGKImage.imageAsynchronouslyNamed(name + ".svg", function (image, parseResult) {
                            _this.nativeView = image;
                            resolve(true);
                        });
                    }
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSourceSVG.prototype.loadFromFile = function (path) {
        var fileName = types.isString(path) ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }
        this.nativeView = SVGKImage.imageWithContentsOfFile(fileName);
        return this.nativeView != null;
    };
    ImageSourceSVG.prototype.fromFile = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var fileName = types.isString(path) ? path.trim() : "";
                if (fileName.indexOf("~/") === 0) {
                    fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
                }
                SVGKImage.imageWithContentsOfFileAsynchronously(fileName, function (image) {
                    _this.nativeView = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSourceSVG.prototype.loadFromData = function (data) {
        this.nativeView = SVGKImage.imageWithData(data);
        return this.nativeView != null;
    };
    ImageSourceSVG.prototype.fromData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                SVGKImage.imageWithDataAsynchronously(data, function (image) {
                    _this.nativeView = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSourceSVG.prototype.loadFromBase64 = function (source) {
        if (types.isString(source)) {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, 1);
            this.nativeView = SVGKImage.imageWithData(data);
        }
        return this.nativeView != null;
    };
    ImageSourceSVG.prototype.fromBase64 = function (source) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var data = NSData.alloc().initWithBase64EncodedStringOptions(source, 1);
                SVGKImage.imageWithDataAsynchronously(data, function (image) {
                    _this.nativeView = image;
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageSourceSVG.prototype.loadFromUrl = function (url) {
        this.nativeView = SVGKImage.imageWithContentsOfURL(NSURL.URLWithString(url));
        return this.nativeView != null;
    };
    ImageSourceSVG.prototype.fromUrl = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.loadFromUrl(url));
        });
    };
    ImageSourceSVG.prototype.setNativeSource = function (source) {
        this.nativeView = source;
        return source != null;
    };
    ImageSourceSVG.prototype.saveToFile = function (path) {
        if (!this.nativeView) {
            return false;
        }
        var data = getImageData(this.nativeView);
        if (data) {
            return data.writeToFileAtomically(path, true);
        }
        return false;
    };
    ImageSourceSVG.prototype.toBase64String = function (format) {
        var res = null;
        if (!this.nativeView) {
            return res;
        }
        var data = getImageData(this.nativeView);
        if (data) {
            res = data.base64EncodedStringWithOptions(1);
        }
        return res;
    };
    Object.defineProperty(ImageSourceSVG.prototype, "height", {
        get: function () {
            if (this.nativeView) {
                return this.nativeView.size.height;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSourceSVG.prototype, "width", {
        get: function () {
            if (this.nativeView) {
                return this.nativeView.size.width;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    return ImageSourceSVG;
}());
exports.ImageSourceSVG = ImageSourceSVG;
function getImageData(instance) {
    var buffer = instance.source.stream;
    throw new Error("Not supported operation");
}
var SVGImage = (function (_super) {
    __extends(SVGImage, _super);
    function SVGImage() {
        var _this = _super.call(this) || this;
        _this._imageSourceAffectsLayout = true;
        _this.nativeView = SVGKFastImageView.alloc().initWithSVGKImage(new SVGKImage());
        return _this;
    }
    SVGImage.prototype._setNativeImage = function (nativeImage) {
        this.nativeView.image = nativeImage.nativeView;
        if (this._imageSourceAffectsLayout) {
            this.requestLayout();
        }
    };
    SVGImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var utils = require("utils/utils");
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this.imageSource ? this.imageSource.width : 0;
        var nativeHeight = this.imageSource ? this.imageSource.height : 0;
        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);
        var finiteWidth = widthMode !== utils.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
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
    };
    SVGImage.prototype[common.imageSourceProperty.setNative] = function (value) {
        var image = value;
        if (!image || !image.nativeView) {
            return;
        }
        this._setNativeImage(image);
    };
    return SVGImage;
}(common.SVGImage));
exports.SVGImage = SVGImage;
