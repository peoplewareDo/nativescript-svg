import svg = require("svg");
import common = require("image-source/image-source-common");
import * as utilsModule from "utils/utils";
import * as fileSystemModule from "file-system";
import * as enumsModule from "ui/enums";

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

export class ImageSourceSVG implements svg.ImageSourceSVG {
    public android: com.larvalabs.svgandroid.SVG;
    public ios: SVGKImage;

    public loadFromResource(name: string): boolean {
        this.android = null;

        ensureUtils();

        var res = utils.ad.getApplicationContext().getResources();
        if (res) {            
	    var identifier: number = res.getIdentifier(name, 'drawable', utils.ad.getApplication().getPackageName());
            if (0 < identifier) {
                // Load SVG
		this.android = new com.larvalabs.svgandroid.SVGParser.getSVGFromResource(res, identifier);
            }
        }

        return this.android != null;
    } 

    public loadFromFile(path: string): boolean {
        ensureFS();

        var fileName = types.isString(path) ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }

        this.android = new com.larvalabs.svgandroid.SVGParser.getSVGFromInputStream(new java.io.FileInputStream( new java.io.File(fileName)));
        return this.android != null;
    }

    public loadFromData(data: any): boolean {
        this.android = new com.larvalabs.svgandroid.SVGParser.getSVGFromString(data);
        return this.android != null;
    }

    public loadFromBase64(source: string): boolean {
	var bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
	this.android = new com.larvalabs.svgandroid.SVGParser.getSVGFromString(new String(bytes));
        return this.android != null;
    }

    public setNativeSource(source: any): boolean {
        this.android = source;
        return source != null;
    }

/**
TODO to be implemented
*/
    public saveToFile(path: string): boolean {
        return false;
    }

    public toBase64String(format: string): string {
        if (!this.android) {
            return null;;
        }

        return android.util.Base64.encodeToString(format, android.util.Base64.DEFAULT);
    }

    get height(): number {
        if (this.android) {
            return this.android.getPitcture().getHeight();
        }

        return NaN;
    }

    get width(): number {
        if (this.android) {
            return this.android.getPitcture().getWidth();
        }

        return NaN;
    }

}
