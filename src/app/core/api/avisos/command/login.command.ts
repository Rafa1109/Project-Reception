export class LoginCommand {
    constructor(login?: string, password?: string) {
        this.login = login;
        this.password = password;
    }

    login?: string;
    password?: string;
}