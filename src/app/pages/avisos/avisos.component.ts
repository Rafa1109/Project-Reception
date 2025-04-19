import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin, lastValueFrom, tap } from "rxjs";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { AvisoCommand } from "src/app/core/api/avisos/command/avisos.command";
import { GuestApi } from "src/app/core/api/avisos/guest-api.controller";
import { AuthService } from "src/app/core/services/authentications/auth.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { WebSocketService } from "src/app/core/services/websocket.service";

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
        private webSocketService: WebSocketService) {
        super();
    }

    canAdd: boolean = false;
    ngOnInit(): void {
        this.webSocketService.connect();
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

    telaState: string = 'grid';
    formAviso: any;
    addAviso = () => {
        this.formAviso = null;
        this.telaState = 'formAvisos';
    }

    avisos: AvisoCommand[] = [];
    totalItems: number = 0;
    getData = () => {

        this.webSocketService.GuestObservable$.subscribe(guest => {
            this.totalItems = + 1;
            return this.avisos.push(new AvisoCommand(guest))
        });


        // return this.guestApi.findAll().pipe(
        //     tap(res => {
        //         this.avisos = [];
        //         res.guests.forEach((obj: any) => {
        //             this.avisos.push(new AvisoCommand(obj));
        //         })
        //         this.totalItems = res.size;
        //     })
        // )
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
        this.requestsOnInit();
    }
}