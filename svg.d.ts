
/**
 * Allows you to parser SVG files.
 */
declare module "svg" {
    import common = require("image-source/image-source-common");
    import imageSource = require('image-source');
       
    /**
     * Encapsulates the common abstraction behind a platform specific object SVG that is used as a source for images.
     */
    export class ImageSourceSVG extends imageSource.ImageSource {
       /**
        * Loads this instance from the specified resource name.
        * @param name The name of the resource (without its extension).
        */
        loadFromResource(name: string): boolean;

       /**
        * Loads this instance from the specified resource name asynchronously.
        * @param name The name of the resource (without its extension).
        */
        fromResource(name: string): Promise<boolean>;
        
       /**
        * Loads this instance from the specified file.
        * @param path The location of the file on the file system.
        */
        loadFromFile(path: string): boolean;

       /**
        * Loads this instance from the specified file asynchronously.
        * @param path The location of the file on the file system.
        */
        fromFile(path: string): Promise<boolean>;

       /**
        * Loads this instance from the specified native image data.
        * @param data The native data (byte array) to load the image from. This will be either Stream for Android or NSData for iOS.
        */
        loadFromData(data: any): boolean;
        
       /**
        * Loads this instance from the specified native image data asynchronously.
        * @param data The native data (byte array) to load the image from. This will be either Stream for Android or NSData for iOS.
        */
        fromData(data: any): Promise<boolean>;        

        /**
         * Loads this instance from the specified native image data.
         * @param source The Base64 string to load the image from.
         */
        loadFromBase64(source: string): boolean;
        
        /**
         * Loads this instance from the specified native image data asynchronously.
         * @param source The Base64 string to load the image from.
         */
        fromBase64(source: string): Promise<boolean>;        

       /**
        * Sets the provided native source object (typically a Bitmap).
        * This will update either the android or ios properties, depending on the target os.
        * @param source The native image object. Will be either a Bitmap for Android or a UIImage for iOS.
        */
        setNativeSource(source: any): boolean;

       /**
        * Saves this instance to the specified file, using the provided image format and quality.
        * @param path The path of the file on the file system to save to.
        */
        saveToFile(path: string): boolean;

        /**
         * Converts the image to base64 encoded string, using the provided image format and quality.
         * @param format The format (encoding) of the image.
         */
        toBase64String(format: string): string;	
    }


}
