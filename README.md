#NativeScript SVG

##Install
`tns plugin add nativescript-svg`

#

###Usage

You use it in the same way you use Image source.

**there are limitations: load from URL and the base64 encondig aren't working**

```js
var SVG = require("nativescript-svg");
var svgParser = new SVG.ImageSourceSVG();

var source = svgParser.imageFromResource('foxie');

var path = '//somepath/file.svg';
source = svgParser.loadFromFile(path);
```

