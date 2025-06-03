import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin, tap } from "rxjs";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { BirthsApi } from "src/app/core/api/aniversarios/births-api.controller";
import { BirthsdaysCommand } from "src/app/core/api/command/birthsdays.command";
import { LoaderService } from "src/app/core/services/loader.service";
import { WebsocketService } from "src/app/core/services/websocket.service";

@Component({
    selector: 'app-aniversarios',
    templateUrl: './aniversarios.component.html'
})
export class AniversariosComponent extends BaseForm implements OnInit {

    constructor(private route: Router,
        private birthsApi: BirthsApi,
        private loaderService: LoaderService,
        private messageService: MessageService,
        private websocketService: WebsocketService
    ) {
        super();
    }

    telaState: 'grid' | 'formBirthday' = 'grid';

    ngOnInit(): void {
        this.requestsOnInit();

        this.websocketService.listen(task => {
            const newBirth = new BirthsdaysCommand(task);
            this.birthsdays = [...this.birthsdays, newBirth]
                .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

            this.messageService.add({
                severity: 'info',
                summary: `Um novo aniversário foi recebido, Total(${this.birthsdays.length})`,
                life: 5000
            });
        });
    }


    requestsOnInit = (showLoader: boolean = false) => {
        if (showLoader)
            this.loaderService.show();

        const requests = [
            this.getData()
        ]

        forkJoin(requests)
            .subscribe({
                next: () => { },
                complete: () => {
                    if (showLoader)
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

    editBirthday = (birthday: any) => {
        this.formBirthday = birthday;
        this.telaState = 'formBirthday';
    }

    back() {
        this.telaState = 'grid';
    }
}