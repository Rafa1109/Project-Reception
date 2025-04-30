import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AuthService } from "src/app/core/services/authentications/auth.service";


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavBarComponent implements OnInit {

    constructor(private authService: AuthService,
        private route: Router,
    ) { }

    items: MenuItem[] = [];
    tokenExpirou: boolean = false;

    ngOnInit(): void {
        this.tokenExpirou = this.authService.tokenExpire();

        this.items = [
            {
                label: this.tokenExpirou ? 'Login' : 'Logout',
                icon: 'pi pi-user',
                command: () => {
                    if (this.tokenExpirou) {
                        this.route.navigate(['/login']);
                    } else {
                        this.authService.logout();
                    }
                }
            },
            {
                label: 'Avisos',
                command: () => this.route.navigate(['/avisos'])
            },
            {
                label: 'Histórico',
                command: () => this.route.navigate(['/historico'])
            }
        ];
    }
}