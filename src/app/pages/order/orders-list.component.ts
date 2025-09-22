import { Component } from '@angular/core';
import { OrderDTO } from 'src/app/core/api/command/order';
import { OrderService } from 'src/app/core/api/order/order.service';
import { MessageService } from "primeng/api";
import { finalize } from 'rxjs/operators';
import { Router } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util/util.service';
import moment from 'moment';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent {
  orders: OrderDTO[] = [];
  valorTotalConfirmado = 0;
  valorTotalPendente = 0;
  loading = false;

  constructor(private api: OrderService,
    private messageService: MessageService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private route: Router
  ) { }

  form = this.fb.group({
    numeroPedido: ['', [Validators.minLength(5)]], // ajuste a regra conforme seu padrão
  });


  ngOnInit() { this.reload(); }

  first = 0;
  reload() {
    this.form.reset({ numeroPedido: '' });
    this.first = 0;
    this.loading = true;
    this.api.listarPedidos()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (list) => {
          this.orders = list.orders;
          this.valorTotalConfirmado = list.valorTotalConfirmado;
          this.valorTotalPendente = list.valorTotalPendente;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos', life: 3000 });
        }
      });
  }


  getStatusSeverity(status: string): string {
    switch (status) {
      case 'CONFIRMADO':
      case 'ENTREGUE':
        return 'success'; // Verde
      case 'CANCELADO':
        return 'danger'; // Vermelho
      case 'PENDENTE':
        return 'warning'; // Laranja
      default:
        return 'info'; // Azul (ou outra cor padrão)
    }
  }

  search(): void {
    this.first = 0;
    const numero = this.form.value.numeroPedido?.toString().trim();
    if (!numero) {
      this.orders = [];
      return;
    }
    this.loading = true;
    this.api.getPedido(numero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (list) => {
          this.orders = list.orders;
          this.valorTotalConfirmado = list.valorTotalConfirmado;
          this.valorTotalPendente = list.valorTotalPendente;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos', life: 3000 });
        }
      });
  }

  clear(): void {
    this.reload();
  }

  newOrder() {
    this.route.navigate([`cj-novo-pedido`]);
  }

  confirmar(o: OrderDTO) {
    if (!confirm(`Confirmar pagamento do pedido ${o.numeroPedido}?`)) return;
    this.api.confirmarPagamento(o.id).subscribe({
      next: () => {
        this.reload()
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado com sucesso!',
          detail: 'Pedido Confirmado',
          life: 3000
        })
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao confirmar pedido', life: 3000 });
      }
    });
  }

  export() {
    this.api.export().subscribe({
      next: (result) => {
        const fileName = `CJ_${moment().format('DD_MM_yyyy_HH:mm')}.csv`;
        this.utilService.downloadArquivo(result, fileName);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao realizar Download',
          life: 3000,
        });
      }
    })
  }

  notify() {
    if (!confirm(`Notificar pagamentos pendentes ?`)) return;
    this.api.notifyPedido()
      .pipe(finalize(() => { }))
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Notificação Enviada!',
            detail: res.message,
            life: 3000
          })
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao notificar pedidos pendentes.', life: 3000 });
        }
      });
  }


  entregar(o: OrderDTO) {
    if (!confirm(`Confirmar entrega do pedido ${o.numeroPedido}?`)) return;
    this.api.entregarPedido(o.id).subscribe({
      next: () => {
        this.reload()
        this.messageService.add({
          severity: 'success',
          summary: 'Entregue!',
          detail: 'Pedido Cancelado',
          life: 3000
        })
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao entregar pedido', life: 3000 });
      }
    });
  }


  cancelar(o: OrderDTO) {
    if (!confirm(`Confirmar cancelamento do pedido ${o.numeroPedido}?`)) return;
    this.api.cancelarPagamento(o.id).subscribe({
      next: () => {
        this.reload()
        this.messageService.add({
          severity: 'success',
          summary: 'Cancelado com sucesso!',
          detail: 'Pedido Cancelado',
          life: 3000
        })
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cancelar pedido', life: 3000 });
      }
    });
  }

  deletar(o: OrderDTO) {
    if (!confirm(`Confirmar exclusão do pedido ${o.numeroPedido}?`)) return;
    this.api.deletarPagamento(o.id).subscribe({
      next: () => {
        this.reload()
        this.messageService.add({
          severity: 'success',
          summary: 'Excluido com sucesso!',
          detail: 'Pedido Excluido',
          life: 3000
        })
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir pedidos', life: 3000 });
      }
    });
  }
}
