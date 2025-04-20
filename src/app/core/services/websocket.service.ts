import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp, } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import { environment } from "src/environments/environment";
import { IMessage } from '@stomp/stompjs';

export type ListenerCallBack = (message: Task) => void;

const apiBaseUrl = environment.api;
const wsProtocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
const wsUrl = apiBaseUrl.replace(/^https?/, wsProtocol) + '/guest/ws';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

    private connection: CompatClient;
    private subscription: StompSubscription | undefined;

    constructor() {
        console.log("Starting a WebSocket connection");

        this.connection = Stomp.over(() => new WebSocket(wsUrl));

        this.connection.reconnectDelay = 5000;

        this.connection.connect({}, () => {
            console.log("WebSocket connected");
        });
    }

    public listen(fun: ListenerCallBack): void {
        if (this.connection && this.connection.connected) {
            this.subscription = this.connection.subscribe('/topic/guests', (message: IMessage) => {
                fun(JSON.parse(message.body));
            });
        } else {
            this.connection.connect({}, () => {
                this.subscription = this.connection!.subscribe('/topic/guests', (message: IMessage) => {
                    fun(JSON.parse(message.body));
                });
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connection && this.connection.connected) {
            this.connection.disconnect(() => {
                console.log("WebSocket disconnected");
            });
        }
    }

}
