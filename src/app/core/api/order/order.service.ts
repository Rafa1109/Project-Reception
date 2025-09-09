// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { OrderCreateRequest, OrderCreateResponse, OrderDTO, OrdersResponse } from 'src/app/core/api/command/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private baseUrl = environment.api;
    constructor(private http: HttpClient) { }

    criarPedido(payload: OrderCreateRequest): Observable<OrderCreateResponse> {
        return this.http.post<OrderCreateResponse>(`${this.baseUrl}/guest/cj/orders`, payload);
    }

    listarPedidos(): Observable<OrdersResponse> {
        return this.http.get<OrdersResponse>(`${this.baseUrl}/guest/cj/orders`);
    }

    confirmarPagamento(id: string): Observable<OrderDTO> {
        return this.http.put<OrderDTO>(`${this.baseUrl}/guest/cj/orders/${id}/confirm`, {});
    }

    cancelarPagamento(id: string): Observable<OrderDTO> {
        return this.http.put<OrderDTO>(`${this.baseUrl}/guest/cj/orders/${id}/cancel`, {});
    }

    deletarPagamento(id: string): Observable<OrderDTO> {
        return this.http.delete<OrderDTO>(`${this.baseUrl}/guest/cj/orders/${id}/delete`, {});
    }


}
