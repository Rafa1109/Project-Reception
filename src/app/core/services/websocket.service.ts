import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    constructor(private stompClient: Client) { }

    private GuestSubject = new Subject<any>();

    GuestObservable$ = this.GuestSubject.asObservable();

    connect() {
        this.stompClient = new Client({
            brokerURL: 'ws://localhost:8080/api/guest/ws',
            webSocketFactory: () => new SockJS('http://localhost:8080/api/guest/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                this.stompClient.subscribe('/topic/guests', (message: Message) => {
                    const novoCliente = JSON.parse(message.body);
                    this.GuestSubject.next(novoCliente);
                });
            }
        });

        this.stompClient.activate();
    }
}
