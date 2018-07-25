import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { MainPage } from "./pages/main-page";
import { NativeScriptSvgModule } from "nativescript-svg/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptSvgModule
    ],
    declarations: [
        AppComponent,
        MainPage
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
