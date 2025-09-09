import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = (control.value || '').replace(/\D/g, '');

    if (!cpf || cpf.length !== 11) {
        return { cpfInvalido: true };
    }

    // elimina CPFs inválidos conhecidos
    if (/^(\d)\1{10}$/.test(cpf)) {
        return { cpfInvalido: true };
    }

    let soma = 0;
    let resto;

    // valida 1º dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return { cpfInvalido: true };
    }

    // valida 2º dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return { cpfInvalido: true };
    }

    return null; // CPF válido
}
