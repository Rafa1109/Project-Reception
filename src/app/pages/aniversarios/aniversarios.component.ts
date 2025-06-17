import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin, tap } from "rxjs";
import { MessageService } from 'primeng/api';
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { BirthsApi } from "src/app/core/api/aniversarios/births-api.controller";
import { BirthsdaysCommand } from "src/app/core/api/command/birthsdays.command";
import { LoaderService } from "src/app/core/services/loader.service";
import { WebsocketService } from "src/app/core/services/websocket.service";
import { ModalConfirmComponent } from 'src/app/components/modais/confirm/confirm.component';
import { AuthService } from "src/app/core/services/authentications/auth.service";


@Component({
    selector: 'app-aniversarios',
    templateUrl: './aniversarios.component.html'
})
export class AniversariosComponent extends BaseForm implements OnInit {

    @ViewChild(ModalConfirmComponent) confirmModal!: ModalConfirmComponent;

    permissions = this.authService.currentUserTokenDetails;

    constructor(private route: Router,
        private birthsApi: BirthsApi,
        private authService: AuthService,
        private websocketService: WebsocketService,
        private messageService: MessageService,
        private loaderService: LoaderService,
    ) {
        super();
    }

    telaState: 'grid' | 'formBirthday' = 'grid';


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
            })
    }

    birthsdays: BirthsdaysCommand[] = [];
    totalItems: number = 0;
    getData = () => {
        return this.birthsApi.getWeek().pipe(
            tap(res => {
                this.birthsdays = res.births.map((obj: any) => new BirthsdaysCommand(obj));
            })
        )
    }

    formBirthday: BirthsdaysCommand | null = null;
    addBirthday = () => {
        this.formBirthday = null;
        this.telaState = 'formBirthday';
    }

    deleteEvento = (id: string) => {
        this.birthsApi.delete(id).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Excluído com sucesso!',
                    detail: 'Aniversário excluído',
                    life: 3000
                })
                this.requestsOnInit();
            }
        })
    }

    confirmDelete = (birthday: any) => {
        this.confirmModal.confirm(`Tem certeza que deseja excluir: ${birthday.name}?`,
            () => {
                this.deleteEvento(birthday.id);
            }
        )
    }

    back() {
        this.telaState = 'grid';
        this.requestsOnInit();
    }
}