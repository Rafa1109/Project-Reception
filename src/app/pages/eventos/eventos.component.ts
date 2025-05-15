import { Component } from '@angular/core';

interface Evento {
    titulo: string;
    data: string;
}

@Component({
    selector: 'app-eventos',
    templateUrl: './eventos.component.html'
})
export class EventosComponent {
    telaState: 'grid' | 'formEventos' = 'grid';

    eventos: Evento[] = [
        { titulo: 'Escola Bíblica Dominical (EBD)', data: '2025-05-03T14:00' },
        { titulo: 'Cantata de Natal', data: '2025-05-04T09:00' },
        { titulo: 'Culto de Missões', data: '2025-05-04T09:00' }
    ];

    eventoFormData: Evento | null = null;

    abrirFormulario() {
        this.eventoFormData = null; // Para novo
        this.telaState = 'formEventos';
    }

    voltarParaGrid() {
        this.telaState = 'grid';
    }
}
