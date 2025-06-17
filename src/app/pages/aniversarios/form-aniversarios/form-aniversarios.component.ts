import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { BirthsApi } from "src/app/core/api/aniversarios/births-api.controller";
import { BirthsdaysCommand } from "src/app/core/api/command/birthsdays.command";

@Component({
    selector: 'app-form-aniversarios',
    templateUrl: './form-aniversarios.component.html'
})
export class FormAniversariosComponent extends BaseForm implements OnInit {

    formBirthday: BirthsdaysCommand = new BirthsdaysCommand();
    formEdit: any;

    @Input() data: any;
    @Output() onBack = new EventEmitter();

    constructor(
        private fb: UntypedFormBuilder,
        private birthsApi: BirthsApi,
        private messageService: MessageService
    ) {
        super();
    }

    title: string = 'Cadastre um novo Aniversariante'
    ngOnInit(): void {
        this.createForm();
        if (this.data) {
            this.editBirthday();
        }
    }

    createForm = () => {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            data: ['', [Validators.required]]
        })
    }

    editBirthday = () => {
        this.title = 'Edição de Aniversário';
        this.formBirthday = new BirthsdaysCommand(this.data);

    }

    laoding: boolean[] = [false];
    onSave = () => {
        this.laoding[0] = true;
        this.birthsApi.save(this.formBirthday).subscribe({
            next: (result) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Salvo com sucesso!',
                    detail: 'Redirecionando Página!',
                    life: 3000
                })
            },
            error: (er) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao salvar aniversário!',
                    detail: this.extractDetailedErrorMessage(er),
                    life: 3000
                })
            }
            , complete: () => {
                this.laoding[0] = false;
                this.onBack.emit();
            }
        })
    }

    backGrid = (emitCall: any) => {
        this.formBirthday = new BirthsdaysCommand();
        this.onBack.emit({});
    }

    extractDetailedErrorMessage(error: any): string {
        if (!error || !error.error) {
            return 'Erro desconhecido.';
        }

        const apiError = error.error;

        if (apiError.errors && Array.isArray(apiError.errors)) {
            return apiError.errors
                .map((e: any) => `• ${e.message}`)
                .join('\n');
        }

        if (apiError.message) {
            return apiError.message;
        }

        return 'Erro inesperado ao processar a requisição.';
    }

}