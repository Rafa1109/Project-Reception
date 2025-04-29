import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin, lastValueFrom, tap } from "rxjs";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { AvisoCommand } from "src/app/core/api/avisos/command/avisos.command";
import { GuestApi } from "src/app/core/api/avisos/guest-api.controller";
import { AuthService } from "src/app/core/services/authentications/auth.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { WebsocketService } from "src/app/core/services/websocket.service";
import { MessageService } from "primeng/api";
import { PermissionService } from "src/app/core/services/authentications/permission.service";


@Component({
    selector: 'app-avisos',
    templateUrl: './avisos.component.html'
})
export class AvisosComponent extends BaseForm implements OnInit {

    @ViewChild('mview') mview?: any

    permissions = this.authService.currentUserTokenDetails;

    constructor(private route: Router,
        private guestApi: GuestApi,
        private authService: AuthService,
        private loaderService: LoaderService,
        private messageService: MessageService,
        private websocketService: WebsocketService,
        private permissionService: PermissionService
    ) {
        super();
    }

    canAdd: boolean = false;
    ngOnInit(): void {
        this.canAdd = this.permissionService.hasPermissionButton("ROLE_USER_WRITER");
        this.requestsOnInit(true);

        this.websocketService.listen(task => {
            console.log('WebSocket recebido:', task);
            const novoAviso = new AvisoCommand(task);
            this.avisos = [...this.avisos, novoAviso]
                .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

            this.messageService.add({
                severity: 'info',
                summary: `Um novo aviso foi recebido, Total(${this.avisos.length})`,
                detail: `Tipo: ${novoAviso.guestTypeDesc}`,
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

    telaState: string = 'grid';
    formAviso: any;
    addAviso = () => {
        this.formAviso = null;
        this.telaState = 'formAvisos';
    }

    avisos: AvisoCommand[] = [];
    totalItems: number = 0;
    getData = () => {
        return this.guestApi.findAll().pipe(
            tap(res => {
                this.avisos = res.guests.map((obj: any) => new AvisoCommand(obj));
                this.totalItems = res.size;
            })
        )
    }

    editAviso = (aviso: any) => {
        this.formAviso = aviso;
        this.telaState = 'formAvisos';
    }

    readAviso = (aviso: AvisoCommand) => {
        this.guestApi.announced(aviso.id).subscribe({
            next: (result) => {
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
        this.readAviso(this.aviso)
        this.mview.closeModal();
    }

    back = (e: any) => {
        this.telaState = 'grid';
        this.requestsOnInit(true);
    }
}