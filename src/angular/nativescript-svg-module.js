"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var nativescript_svg_directives_1 = require("./nativescript-svg-directives");
var NativeScriptSvgModule = (function () {
    function NativeScriptSvgModule() {
    }
    NativeScriptSvgModule = __decorate([
        core_1.NgModule({
            declarations: [nativescript_svg_directives_1.DIRECTIVES],
            exports: [nativescript_svg_directives_1.DIRECTIVES],
        })
    ], NativeScriptSvgModule);
    return NativeScriptSvgModule;
}());
exports.NativeScriptSvgModule = NativeScriptSvgModule;
element_registry_1.registerElement("SVGImage", function () { return require("../").SVGImage; });
