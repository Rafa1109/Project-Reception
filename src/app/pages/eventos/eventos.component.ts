import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin, tap } from 'rxjs';
import { BaseForm } from 'src/app/components/base-form/base-form.component';
import { ModalConfirmComponent } from 'src/app/components/modais/confirm/confirm.component';
import { EventoCommand } from 'src/app/core/api/command/eventos.command';
import { EventsApi } from 'src/app/core/api/eventos/events-api.controller';
import { AuthService } from 'src/app/core/services/authentications/auth.service';
import { PermissionService } from 'src/app/core/services/authentications/permission.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
    selector: 'app-eventos',
    templateUrl: './eventos.component.html'
})
export class EventosComponent extends BaseForm implements OnInit {

    @ViewChild(ModalConfirmComponent) confirmModal!: ModalConfirmComponent;

    constructor(private route: Router,
        private eventsApi: EventsApi,
        private authService: AuthService,
        private loaderService: LoaderService,
        private messageService: MessageService,
        private websocketService: WebsocketService,
        private permissionService: PermissionService
    ) {
        super();
    }

    telaState: 'grid' | 'formEventos' = 'grid';

    ngOnInit(): void {
        this.requestsOnInit(true);

        this.websocketService.listen(task => {
            const novoEvento = new EventoCommand(task);
            this.eventos = [...this.eventos, novoEvento]
                .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

            this.messageService.add({
                severity: 'info',
                summary: `Um novo aviso foi recebido, Total(${this.eventos.length})`,
                detail: `Tipo: ${novoEvento.departamentName}`,
                life: 5000
            });
        });
    }

    requestsOnInit = (showLoader: boolean = false) => {
        if (showLoader) {
            this.loaderService.show();
        }

        const requests = [
            this.getData()
        ]

        forkJoin(requests)
            .subscribe({
                next: () => { },
                complete: () => {
                    if (showLoader) {
                        this.loaderService.hide();
                    }
                }
            });
    }

    eventos: EventoCommand[] = [];
    totalItems: number = 0;
    getData = () => {
        return this.eventsApi.getAll().pipe(
            tap(res => {
                console.log('res', res)
                this.eventos = res.events.map((obj: any) => new EventoCommand(obj));
                this.totalItems = res.size;
            })
        )
    }

    editEvento = (evento: any) => {
        console.log(evento);
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
        this.confirmModal.confirm(`Tem certeza que deseja excluir este evento ${evento.departamentName} - ${evento.eventName}?`,
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
    }
}
