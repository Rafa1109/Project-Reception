import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { AvisoCommand } from "src/app/core/api/command/avisos.command";
import { GuestApi } from "src/app/core/api/avisos/guest-api.controller";
import { ENUMS } from "src/app/core/enum";
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
        this.getDepartaments();
        if (this.data) {
            this.editAviso();
        }
    }

    createForm = () => {
        this.form = this.fb.group({
            departamento: ['', [Validators.required]],
            data: ['', [Validators.required]],
            message: ['', [Validators.required]]
        })
    }

    editAviso = () => {
        this.title = 'Edição de aviso';
        this.eventoForm = new EventoCommand(this.data);

    }

    departaments: any[] = [];
    getDepartaments = () => {
        this.utilsApi.departaments().subscribe({
            next: (result) => {
                this.departaments = result;
            }
        })
    }

    laoding: boolean[] = [false];
    onSave = () => {
        this.laoding[0] = true;
        this.eventApi.save(this.eventoForm).subscribe({
            next: (result) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Salvo com sucesso!',
                    detail: 'Redirecionando Página!',
                    life: 3000
                })
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao salvar evento!',
                    detail: 'Algo deu errado!',
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
}