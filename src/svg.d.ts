/**
 * Allows you to parse SVG files.
 */

    import { Property } from "tns-core-modules/ui/core/dependency-observable";
    import { View } from "tns-core-modules/ui/core/view";

    /**
     * Represents a class that provides functionality for loading svg(s).
     */
    export class SVGImage extends View {
        public static srcProperty: Property;
        public static imageSourceProperty: Property;
        public static isLoadingProperty: Property;

        /**
         * Gets or sets the image source of the image.
         */
        imageSource: ImageSourceSVG;

        /**
         * Gets or sets the source of the svg. This can be either an URL string or a native svg instance.
         */
        src: any;

        /**
         * Gets a value indicating if the svg is currently loading
         */
        isLoading: boolean;

        /**
         * Gets or sets the loading strategy for images on the local file system:
         * - **sync** *(default)* - blocks the UI if necessary to display immediately, good for small icons.
         * - **async** - will try to load in the background, may appear with short delay, good for large images.
         */
        loadMode: string; // "sync" | "async";        
    }


    /**
    * Provides common options for creating a animation
    */
    export interface Options {

        /**
         * Gets or sets the URL of the svg
         */
        src: string;
    }

    /**
     * Encapsulates the common abstraction behind a platform specific object SVG that is used as a source for images.
     */
    export class ImageSourceSVG {

        /**
         * Gets the height of this instance. This is a read-only property.
         */
        height: number;

        /**
         * Gets the width of this instance. This is a read-only property.
         */
        width: number;

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
         * Loads this instance from the specified url.
         * @param url string to load the image from.
         */
        loadFromUrl(url: string): boolean;

        /**
         * Loads this instance from the specified url asynchronously.
         * @param url string to load the image from.
         */
        fromUrl(url: string): Promise<boolean>;

        /**
         * Sets the provided native source object.
         * This will update either the android or ios properties, depending on the target os.
         * @param source The native image object. Will be either a svg for Android or a UIImage for iOS.
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

    /**
     * Creates a new ImageSourceSVG instance and loads it from the specified resource name.
     * @param name The name of the resource (without its extension).
     */
    export function fromResource(name: string): ImageSourceSVG;

    /**
     * Creates a new ImageSourceSVG instance and loads it from the specified file.
     * @param path The location of the file on the file system.
     */
    export function fromFile(path: string): ImageSourceSVG;

    /**
     * Creates a new ImageSourceSVG instance and loads it from the specified resource name.
     * @param data The native data (byte array) to load the image from. This will be either Stream for Android or NSData for iOS.
     */
    export function fromData(data: any): ImageSourceSVG;

    /**
     * Creates a new ImageSourceSVG instance and loads it from the specified resource name.
     * @param source The Base64 string to load the image from.
     */
    export function fromBase64(source: string): ImageSourceSVG;

    /**
     * Creates a new ImageSourceSVG instance and sets the provided native source object.
     * The native source object will update either the android or ios properties, depending on the target os.
     * @param source The native image object. Will be either a Bitmap for Android or a UIImage for iOS.
     */
    export function fromNativeSource(source: any): ImageSourceSVG;

    /**
     * Downloads the image from the provided Url and creates a new ImageSourceSVG instance from it.
     * @param url The link to the remote image object. This operation will download and decode the image.
     */
    export function fromUrl(url: string): Promise<ImageSourceSVG>;

    /**
     * Creates a new ImageSourceSVG instance and loads it from the specified local file or resource(if spexified with "res://" prefix)
     * @param path The location of the file on the file system.
     */
    export function fromFileOrResource(path: string): ImageSourceSVG;

    /**
     * [Obsolete. Please use utils.isFileOrResourcePath instead!] Returns true if the specified path points to a resource or local file.
     * @param path The path.
     */
    export function isFileOrResourcePath(path: string): boolean
