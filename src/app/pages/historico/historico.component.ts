import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { MessageService } from "primeng/api";
import { forkJoin, tap } from "rxjs";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { ModalConfirmComponent } from "src/app/components/modais/confirm/confirm.component";
import { AvisoCommand } from "src/app/core/api/command/avisos.command";
import { GuestApi } from "src/app/core/api/avisos/guest-api.controller";
import { AuthService } from "src/app/core/services/authentications/auth.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { UtilService } from "src/app/core/services/util/util.service";
import { WebsocketService } from "src/app/core/services/websocket.service";

@Component({
    selector: 'app-historico',
    templateUrl: './historico.component.html'
})
export class HistoricoComponent extends BaseForm implements OnInit {

    @ViewChild('mview') mview?: any;
    @ViewChild(ModalConfirmComponent) confirmModal!: ModalConfirmComponent;

    permissions = this.authService.currentUserTokenDetails;

    constructor(private route: Router,
        private guestApi: GuestApi,
        private authService: AuthService,
        private loaderService: LoaderService,
        private messageService: MessageService,
        private websocketService: WebsocketService,
        private utilService: UtilService) {
        super();
    }

    canAdd: boolean = false;
    ngOnInit(): void {
        this.websocketService.disconnect();
        this.canAdd = this.permissions?.roles?.includes("ROLE_USER_WRITER");
        this.requestsOnInit();
    }

    requestsOnInit = () => {
        const requests = [
            this.getData()
        ]

        this.loaderService.show();

        forkJoin(requests)
            .subscribe({
                next: () => { },
                complete: () => {
                    this.loaderService.hide();
                }
            });
    }

    export = () => {
        this.guestApi.export().subscribe({
            next: (result) => {
                const fileName = `Historico_${moment().format('DD_MM_yyyy_HH:mm')}.csv`;
                this.utilService.downloadArquivo(result, fileName);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao realizar Download',
                    life: 3000,
                });
            }
        })
    }

    avisos: AvisoCommand[] = [];
    totalItems: number = 0;
    getData = () => {
        return this.guestApi.history().pipe(
            tap(res => {
                console.log(res)
                this.avisos = [];
                res.guests.forEach((obj: any) => {
                    this.avisos.push(new AvisoCommand(obj));
                })
                this.totalItems = res.size;
            })
        )
    }

    unreadAviso = (aviso: AvisoCommand) => {
        this.guestApi.unread(aviso.id).subscribe({
            next: (result) => {
                this.requestsOnInit();
            }
        })

    }

    deleteAviso = (id: string) => {
        this.guestApi.delete(id).subscribe({
            next: (result) => {
                this.mview.closeModal();
                this.requestsOnInit();
            }
        })
    }

    aviso: AvisoCommand = new AvisoCommand();
    title: string = 'Este é o aviso!';
    modalView = (obj: any) => {
        this.aviso = obj;
        this.title = obj.guestTypeDesc;
        this.mview.openModal();
    }

    closeModal = (obj: any) => {
        this.aviso = new AvisoCommand(obj);
        this.unreadAviso(this.aviso)
        this.mview.closeModal();
    }

    confirmDelete = (id: string) => {
        this.confirmModal.confirm(`Tem certeza que deseja excluir este aviso ${this.aviso.guestTypeDesc}?`,
            () => {
                this.deleteAviso(id);
            }
        )
    }
}