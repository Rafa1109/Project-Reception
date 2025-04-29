import { Component, Input, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm.component.html'
})
export class ModalConfirmComponent implements OnInit {
    constructor(
        public confirmationService: ConfirmationService
    ) { }
    
    ngOnInit(): void {
        
    }

    confirm(
    message: string,
    acceptCallback: () => void,
    rejectCallback?: () => void,
    header: string = 'Confirmação',
    icon: string = 'pi pi-exclamation-triangle'
    ) {
        this.confirmationService.confirm({
            message: message,
            header: header,
            icon: icon,
            accept: acceptCallback,
            reject: rejectCallback || (() => {})  // <- se não passar, vira função vazia
        });
    }

}