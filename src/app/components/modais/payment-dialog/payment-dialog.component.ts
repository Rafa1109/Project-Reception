import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface PaymentDialogData {
  title: string;
  qrCodeUrl?: string;
  copiaECola?: string;
  paymentLink?: string;
  frase?: string; // texto exibido abaixo do botão Fechar (footer)
}

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html'
})
export class PaymentDialogComponent {
  @Input() data?: PaymentDialogData;

  // controla o p-dialog
  visible = false;

  constructor(private messageService: MessageService) { }

  /** Abre o diálogo com os dados informados */
  open(data: PaymentDialogData) {
    this.data = data;
    this.visible = true;
  }

  /** Copia o código Pix "copia e cola" para a área de transferência */
  copyPix() {
    const texto = this.data?.copiaECola;
    if (!texto) return;

    navigator.clipboard.writeText(texto).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Copiado!', detail: 'Código Pix copiado para área de transferência.' });
    }).catch(() => {
      // fallback para navegadores/ambientes sem clipboard API
      const tmp = document.createElement('textarea');
      tmp.value = texto;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      this.messageService.add({ severity: 'success', summary: 'Copiado!', detail: 'Código Pix copiado para área de transferência.' });
    });
  }

  /** Fecha o diálogo */
  close() {
    this.visible = false;
  }
}
