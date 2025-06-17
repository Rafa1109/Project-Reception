import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin, tap } from 'rxjs';
import { BaseForm } from 'src/app/components/base-form/base-form.component';
import { ModalConfirmComponent } from 'src/app/components/modais/confirm/confirm.component';
import { EventoCommand } from 'src/app/core/api/command/eventos.command';
import { EventsApi } from 'src/app/core/api/eventos/events-api.controller';
import { LoaderService } from 'src/app/core/services/loader.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { AuthService } from "src/app/core/services/authentications/auth.service";

@Component({
    selector: 'app-eventos',
    templateUrl: './eventos.component.html'
})
export class EventosComponent extends BaseForm implements OnInit {

    @ViewChild(ModalConfirmComponent) confirmModal!: ModalConfirmComponent;

    permissions = this.authService.currentUserTokenDetails;

    constructor(private route: Router,
        private eventsApi: EventsApi,
        private authService: AuthService,
        private loaderService: LoaderService,
        private messageService: MessageService,
        private websocketService: WebsocketService
    ) {
        super();
    }

    telaState: 'grid' | 'formEventos' = 'grid';

    canAdd: boolean = false;
    ngOnInit(): void {
        this.canAdd = this.permissions?.roles?.includes("ROLE_USER_WRITER");
        this.websocketService.disconnect();
        this.requestsOnInit();
    }

    requestsOnInit = () => {
        this.loaderService.show();

        const requests = [
            this.getData()
        ]

        forkJoin(requests)
            .subscribe({
                next: () => { },
                complete: () => {
                    this.loaderService.hide();
                }
            });
    }

    eventos: EventoCommand[] = [];
    totalItems: number = 0;
    getData = () => {
        return this.eventsApi.getAll().pipe(
            tap(res => {
                this.eventos = res.events.map((obj: any) => new EventoCommand(obj));
                this.totalItems = res.size;
            })
        )
    }

    editEvento = (evento: any) => {
        this.formEvento = evento;
        this.telaState = 'formEventos';
    }

    deleteEvento = (id: string) => {
        this.eventsApi.delete(id).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Excluído com sucesso!',
                    detail: 'Evento excluído',
                    life: 3000
                })
                this.requestsOnInit();
            }
        })
    }

    confirmDelete = (evento: any) => {
        this.confirmModal.confirm(`Tem certeza que deseja excluir este evento ${evento.departmentName} - ${evento.eventName}?`,
            () => {
                this.deleteEvento(evento.id);
            }
        )
    }

    formEvento: EventoCommand | null = null;
    addEvento() {
        this.formEvento = null;
        this.telaState = 'formEventos';
    }

    back() {
        this.telaState = 'grid';
        this.requestsOnInit();
    }
}
