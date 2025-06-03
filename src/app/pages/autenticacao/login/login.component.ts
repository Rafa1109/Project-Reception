import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { BaseForm } from "src/app/components/base-form/base-form.component";
import { LoginCommand } from "src/app/core/api/command/login.command";
import { FormValidatorHelper } from "src/app/core/helpers/form-validation";
import { AuthService } from "src/app/core/services/authentications/auth.service";
import { WebsocketService } from "src/app/core/services/websocket.service";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent extends BaseForm implements OnInit {

    loginCommand: LoginCommand = new LoginCommand();

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private websocketService: WebsocketService,
        private route: Router
    ) {
        super();

        this.validationMessages = {
            login: { required: 'Campo Obrigatório' },
            senha: { required: 'Campo Obrigatório' }
        }

        this.formValidator = new FormValidatorHelper(this.validationMessages);
    }

    ngOnInit(): void {
        this.websocketService.disconnect();
        this.form = this.fb.group({
            login: ['', [Validators.required]],
            senha: ['', [Validators.required]]
        });
        this.loginEnter();
    }

    passwordView: boolean = false;
    onPasswordView() {
        this.passwordView = !this.passwordView;
    }

    onBlur(input: string) {
        this.checkValidity(input);
    }

    loginEnter() {
        document.addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
                let btn = document.getElementById('btnLogin');
                btn?.click();
            }
        });
    }

    loading: boolean[] = [false];
    login = () => {
        this.loading[0] = true;
        this.authService.login(this.loginCommand.login ?? "", this.loginCommand.password ?? "").subscribe({
            next: (result) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Autenticado',
                    detail: 'Redirecionando página!',
                    life: 3000,
                });
                this.loading[0] = false
                this.route.navigate([`avisos`]);
            }, error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao realizar login',
                    detail: 'Usuário ou senha inválidos',
                    life: 3000
                })
                this.loading[0] = false;
            }
        })
    }

}