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


```js
var SVG = require("nativescript-svg");
var svgParser = new SVG.ImageSourceSVG();

var loaded = svgParser.imageFromResource('foxie');

var path = '//somepath/file.svg';
loaded = svgParser.loadFromFile(path);

var url = 'http://somepath/file.svg';
loaded = svgParser.loadFromUrl(url);

if(loaded){
    console.log("object loaded");
} else {
    console.log("error");
}
```

###Roadmap
Implement image tag to be used as for example:
```xml
<Image src="~/images/logo.svg" stretch ="none" />
```


###Release note
v.1.0.11 -- Major fix for load library issue

v1.0.9 -- load from URL on Android and IOS included.

v1.0.7 -- Fix svg.common override issue

v1.0.5 -- fix for npm package lib not including the .js files.

v1.0.2 -- the base64 encondig on Android included - IOS pending.

