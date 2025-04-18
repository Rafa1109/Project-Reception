import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-modal-confirm',
    templateUrl: './confirm.component.html'
})
export class ModalConfirmComponent implements OnInit {
    constructor() { }

    @Input() title: string = '';

    ngOnInit(): void {
        
    }

    displayModal = false;

    openModal = () => (this.displayModal = true);

    closeModal = () => (this.displayModal = false);
}