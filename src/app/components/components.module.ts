import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { PrimeNGModules } from "../core/modules/primeng.module";
import { BaseContentComponent } from "./base-content/base-content.component";
import { LoadingComponent } from "./loading/loading.component";
import { LogoComponent } from "./logo/logo.component";
import { ModalViewComponent } from "./modais/view/view.component";
import { NavBarComponent } from "./navbar/navbar.component";
import { ModalConfirmComponent } from "./modais/confirm/confirm.component";
import { PagePermission } from "./pages-error/page-permission/page-permission";

@NgModule({
    declarations: [
        NavBarComponent,
        ModalViewComponent,
        ModalConfirmComponent,
        BaseContentComponent,
        LogoComponent,
        LoadingComponent,
        PagePermission
    ],
    imports: [
        PrimeNGModules,
        DialogModule,
        CommonModule
    ],
    exports: [
        NavBarComponent,
        BaseContentComponent,
        ModalViewComponent,
        ModalConfirmComponent,
        LogoComponent,
        LoadingComponent,
        PagePermission
    ]
})
export class ComponentsModule { }