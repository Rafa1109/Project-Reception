import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AuthService } from "src/app/core/services/authentications/auth.service";
import { PermissionService } from "src/app/core/services/authentications/permission.service";


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavBarComponent implements OnInit {

    constructor(private authService: AuthService,
        private permissionService: PermissionService,
        private route: Router,
    ) { }

    items: MenuItem[] = [];
    tokenExpirou: boolean = false;

    ngOnInit(): void {
        this.tokenExpirou = this.authService.tokenExpire();

        // Adiciona login/logout sempre
        this.items.push({
            label: this.tokenExpirou ? 'Login' : 'Logout',
            icon: 'pi pi-user',
            command: () => {
                if (this.tokenExpirou) {
                    this.route.navigate(['/login']);
                } else {
                    this.authService.logout();
                }
            }
        });

        // Exemplo: só mostra "Avisos" se tiver role "ROLE_USER_READ"
        if (this.permissionService.hasPermissionButton("ROLE_USER_READ")) {
            this.items.push({
                label: 'Avisos',
                command: () => this.route.navigate(['/avisos'])
            });
        }

        // Exemplo: só mostra "Aniversarios" se tiver role "ROLE_USER_WRITER"
        if (this.permissionService.hasPermissionButton("ROLE_USER_READ")) {
            this.items.push({
                label: 'Aniversariantes',
                command: () => this.route.navigate(['/aniversarios'])
            });
        }

        // Exemplo: só mostra "Eventos" se tiver role "ROLE_USER_WRITER"
        if (this.permissionService.hasPermissionButton("ROLE_USER_READ")) {
            this.items.push({
                label: 'Eventos',
                command: () => this.route.navigate(['/eventos'])
            });
        }

        // Exemplo: só mostra "Histórico" se tiver role "ROLE_USER_WRITER"
        if (this.permissionService.hasPermissionButton("ROLE_USER_WRITER")) {
            this.items.push({
                label: 'Histórico',
                command: () => this.route.navigate(['/historico'])
            });
        }

    }
}