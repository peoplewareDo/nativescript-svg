[![npm](https://img.shields.io/npm/v/nativescript-svg.svg)](https://www.npmjs.com/package/nativescript-svg)
[![npm](https://img.shields.io/npm/dt/nativescript-svg.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-svg)
#NativeScript SVG

##Install
`tns plugin add nativescript-svg`

#

###Usage

You use it in the same way you use Image source.

Android Library | iOS CocoaPod
--------------- | ------------
[pents90 svg-android](https://github.com/pents90/svg-android) | [SVGKit by SVGKit](https://github.com/SVGKit/SVGKit)

**there are limitations: saveToFile aren't working**

###Quick start
```js
var ImageSourceSVGModule = require("nativescript-svg");
var svgFile = new ImageSourceSVGModule.ImageSourceSVG();

var loaded = svgFile.fromResource('foxie');

var path = '//somepath/file.svg';
loaded = svgFile.loadFromFile(path);

var url = 'http://somepath/file.svg';
loaded = svgFile.loadFromUrl(url);

if(loaded){
    console.log("object loaded");
} else {
    console.log("error");
}
```

## API

##### ImageSourceSVGModule.fromResource(name: string): ImageSourceSVG
- Loads this instance from the specified resource name.

##### ImageSourceSVGModule.fromFile(path: string): ImageSourceSVG
- Creates a new ImageSourceSVG instance and loads it from the specified file.

##### ImageSourceSVGModule.fromData(data: any): ImageSourceSVG
- Creates a new ImageSourceSVG instance and loads it from the specified resource name.

##### ImageSourceSVGModule.fromBase64(source: string): ImageSourceSVG
- Creates a new ImageSourceSVG instance and loads it from the specified resource name.

##### ImageSourceSVGModule.fromBase64(source: string): ImageSourceSVG
- Creates a new ImageSourceSVG instance and loads it from the specified resource name.

##### ImageSourceSVGModule.fromUrl(url: string): Promise<ImageSourceSVG>;
- Downloads the image from the provided Url and creates a new ImageSourceSVG instance from it.

***
You can call every method in two way, for example:
```
//from the svf file object
svgFile.loadFromResource(name: string): boolean
```
or 
```
//from the svg module api
ImageSourceSVGModule.fromResource(name: string): ImageSourceSVG
```

###Roadmap
Implement a similar image tag to be used as for example:
```xml
<Image src="~/images/logo.svg" stretch ="none" />

<Page xmlns="http://schemas.nativescript.org/tns.xsd"
      xmlns:svg="nativescript-svg" loaded="pageLoaded">
  <StackLayout>
    <svg:svg src="~/image/nativescript.svg" height="100" />
    <svg:svg src="https://media4.giphy.com/media/3uyIgVxP1qAjS/200.svg" height="200" />
  </StackLayout> 
</Page>  
```


###Release note
v.1.0.11 -- Major fix for load library issue.

v1.0.9 -- load from URL on Android and IOS included.

v1.0.7 -- Fix svg.common override issue.

v1.0.5 -- fix for npm package lib not including the .js files.

v1.0.2 -- the base64 encondig on Android included - IOS pending.

