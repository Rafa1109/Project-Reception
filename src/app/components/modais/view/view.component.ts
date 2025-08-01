import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AvisoCommand } from "src/app/core/api/command/avisos.command";

@Component({
    selector: 'app-modal-view',
    templateUrl: './view.component.html'
})
export class ModalViewComponent implements OnInit {
    constructor() { }

    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() form: AvisoCommand = new AvisoCommand();
    @Input() labelPrimaryButton: string = '';
    @Input() labelSecondButton: string = '';
    @Input() page: string = '';

    @Output() onPrimaryClick = new EventEmitter();
    @Output() onSecondClick = new EventEmitter();

    ngOnInit(): void {
    }

    displayModal = false;

    openModal = () => (this.displayModal = true);

    closeModal = () => (this.displayModal = false);

    primaryClick = () => {
        this.closeModal();
        this.onPrimaryClick.emit();
    }

    secondClick = () => {
        this.onSecondClick.emit();
    }

    tratarValueType = (form: AvisoCommand) => {
        return form.guestTypeDesc
    }
}