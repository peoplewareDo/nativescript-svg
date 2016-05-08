
/**
 * Allows you to parser SVG files.
 */
declare module "svg" {

    import imageSource = require("image-source");
	
    /**
     * Encapsulates the common abstraction behind a platform specific object SVG that is used as a source for images.
     */
    export class ImageSourceSVG extend imageSource.ImageSource {
	
    }

}
