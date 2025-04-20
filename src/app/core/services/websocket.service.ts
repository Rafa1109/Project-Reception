import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';

export type ListenerCallBack = (message: Task) => void;

@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

    private connection: CompatClient | undefined = undefined;

    private subscription: StompSubscription | undefined;

    constructor() {
        console.log("Starting a WebSocket connection");
        this.connection = Stomp.client('ws://localhost:8080/api/guest/ws');
        this.connection.connect({}, () => { });
    }

    public listen(fun: ListenerCallBack): void {
        if (this.connection) {
            this.connection.connect({}, () => {
                this.subscription = this.connection!.subscribe('/topic/guests', message => fun(JSON.parse(message.body)));
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}