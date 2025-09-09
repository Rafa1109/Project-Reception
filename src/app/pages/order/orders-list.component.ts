import { Component } from '@angular/core';
import { OrderDTO } from 'src/app/core/api/command/order';
import { OrderService } from 'src/app/core/api/order/order.service';
import { MessageService } from "primeng/api";
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent {
  orders: OrderDTO[] = [];
  loading = false;

  constructor(private api: OrderService,
    private messageService: MessageService,
  ) { }

  ngOnInit() { this.reload(); }

  reload() {
    this.loading = true;
    this.api.listarPedidos()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (list) => {
          this.orders = list.orders;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos', life: 3000 });
        }
      });
  }

  confirmar(o: OrderDTO) {
    if (!confirm(`Confirmar pagamento do pedido ${o.id}?`)) return;
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

  cancelar(o: OrderDTO) {
    if (!confirm(`Confirmar cancelamento do pedido ${o.id}?`)) return;
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
    if (!confirm(`Confirmar exclusão do pedido ${o.id}?`)) return;
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
