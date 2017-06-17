import { Directive } from "@angular/core"; // TODO: check require .Directive without hacks

@Directive({
    selector: "SVGImage"
})
export class SVGImageDirective { }

export const DIRECTIVES = [SVGImageDirective];
