import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { EventoCommand } from "src/app/core/api/command/eventos.command";
import { EventsApi } from "src/app/core/api/eventos/events-api.controller";
import { UtilsApi } from "src/app/core/api/utils/utils-api.controller";

@Component({
    selector: 'app-form-eventos',
    templateUrl: './form-eventos.component.html'
})
export class FormEventosComponent extends BaseForm implements OnInit {

    eventoForm: EventoCommand = new EventoCommand();
    formEdit: any;

    @Input() data: any;
    @Output() onBack = new EventEmitter();

    constructor(
        private fb: UntypedFormBuilder,
        private eventApi: EventsApi,
        private utilsApi: UtilsApi,
        private messageService: MessageService
    ) {
        super();
    }

    title: string = 'Cadastre um novo Evento'
    ngOnInit(): void {
        this.createForm();
        this.getDepartments();
    }

    createForm = () => {
        this.form = this.fb.group({
            departamento: ['', [Validators.required]],
            data: ['', [Validators.required]],
            message: ['', [Validators.required]]
        })
    }

    departments: any[] = [];
    getDepartments = () => {
        this.utilsApi.departments().subscribe({
            next: (result) => {
                this.departments = result;
            }
        })
    }

    laoding: boolean[] = [false];
    onSave = () => {
        this.laoding[0] = true;
        this.eventApi.save(this.eventoForm)
            .subscribe({
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
                        summary: 'Erro ao salvar evento!',
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
        this.eventoForm = new EventoCommand();
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