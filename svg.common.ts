import utils = require("utils/utils");

// This is used for definition purposes only, it does not generate JavaScript for it.
import definition = require("svg");

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