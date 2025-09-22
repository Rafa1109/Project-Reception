import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrderService } from 'src/app/core/api/order/order.service';
import { OrderCreateResponse, PRODUTO_FIXO, VALOR_UNITARIO_FIXO } from 'src/app/core/api/command/order';
import { PaymentDialogComponent } from 'src/app/components/modais/payment-dialog/payment-dialog.component';
import { cpfValidator } from 'src/app/core/helpers/cpf-validator';
import { phone11Validator } from 'src/app/core/helpers/phone.validators';
import { MessageService } from "primeng/api";


type OpcaoPagamento = 'PIX' | 'CARTAO';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent {
  @ViewChild('paymentDlg') paymentDlg?: PaymentDialogComponent;

  constructor(private fb: FormBuilder,
    private api: OrderService,
    private messageService: MessageService,) { }

  loading = false;
  readonly valorUnitario = VALOR_UNITARIO_FIXO;

  form = this.fb.nonNullable.group({
    // cpf: ['', [Validators.required, cpfValidator]],
    nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
    // email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, phone11Validator]],
    produto: [{ value: PRODUTO_FIXO, disabled: true }], // fixo
    qtd: [1, [Validators.required, Validators.min(1)]],
    opcaoPagamento: ['PIX' as OpcaoPagamento, [Validators.required]],
    apelido: ['', '']
  });

  get total(): number {
    const qtd = this.form.get('qtd')?.value ?? 1;
    return (Number(qtd) || 1) * this.valorUnitario;
  }

  onSubmit() {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;

    // getRawValue inclui campos disabled (ex.: produto)
    const raw = this.form.getRawValue();

    const payload = {
      // cpf: raw.cpf.replace(/\D/g, ''),
      nomeCompleto: raw.nomeCompleto,
      apelido: raw.apelido,
      // email: raw.email,
      telefone: raw.telefone,
      produto: raw.produto,                 // "Hambúrguer CJ"
      qtd: Number(raw.qtd) || 1,
      opcaoPagamento: raw.opcaoPagamento as OpcaoPagamento,
      valorUnitario: this.valorUnitario,    // 45 fixo
      valorTotal: this.total,               // qtd * valorUnitario
    };

    this.api.criarPedido(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: OrderCreateResponse) => {
          // Abre modal conforme forma de pagamento e dados retornados
          if (payload.opcaoPagamento === 'PIX' && res.qrCodeUrl) {
            this.paymentDlg?.open({ title: 'Pagamento via Pix', qrCodeUrl: res.qrCodeUrl, copiaECola: res.copiaECola });
          } else if (payload.opcaoPagamento === 'CARTAO' && res.paymentLink) {
            this.paymentDlg?.open({ title: 'Pagamento via Cartão', paymentLink: res.paymentLink });
          } else {
            this.paymentDlg?.open({ title: 'Detalhes de pagamento não disponíveis' });
          }

          // Reset mantendo defaults (produto fixo, qtd=1, opcaoPagamento padrão)
          this.form.reset({
            // cpf: '',
            nomeCompleto: '',
            apelido: '',
            // email: '',
            telefone: '',
            produto: 'Hambúrguer CJ',
            qtd: 1,
            opcaoPagamento: 'PIX',
          });
        },
        error: (err) => {
          alert('Erro ao registrar pedido: ' + (err?.error?.message || 'tente novamente'));
        },
      });
  }
}
