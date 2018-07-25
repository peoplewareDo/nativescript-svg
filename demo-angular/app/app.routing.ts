import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { MainPage } from "./pages/main-page";

const routes: Routes = [
    { path: "", redirectTo: "/main-page", pathMatch: "full" },
    { path: "main-page", component: MainPage }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }