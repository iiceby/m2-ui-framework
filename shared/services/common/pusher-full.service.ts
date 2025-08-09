import { Injectable, OnDestroy } from '@angular/core';

import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { BaseSingletonService } from './base-singleton.service';

import { TokenService } from './token.service';

@Injectable()
export class PusherFullService extends BaseSingletonService implements OnDestroy {

    private hubsList:{ hubName: string, withAuth: boolean }[] = [];
    private apiUrl: string;

    private rConnections: { [hub: string]: HubConnection } = {};
    private hubs: { [hub: string]: { [hubMethod: string]: Subject<any> } } = {};
    private online: { [hub: string]: boolean } = {};
    private unsubscribe = new Subject();

    constructor(private tokenService: TokenService, private logger: LoggerService) {
        super('PusherService');

        this.reconnect();
    }

    public init(apiUrl: string, hubs: { hubName: string, withAuth: boolean }[]) {
        this.apiUrl = apiUrl;
        this.hubsList = hubs;
    }

    public ngOnDestroy() {
        for (const hub in this.rConnections) {
            if (this.rConnections.hasOwnProperty(hub)) {
                if (this.rConnections[hub]) {
                    this.rConnections[hub].stop();
                }
                for (const hubMethod in this.hubs) {
                    if (this.hubs.hasOwnProperty(hubMethod)) {
                        this.hubs[hub][hubMethod].complete();
                        if (this.rConnections[hub]) {
                            this.rConnections[hub].off(hubMethod);
                        }
                    }
                }
            }
        }
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    public subscribeToHub<T>(hubData: { hub: string, method: string }): Subject<T> {
        this.listenHub(hubData.hub, hubData.method);
        return this.hubs[hubData.hub][hubData.method];
    }

    public reconnect() {
        this.hubsList.forEach(hub => this.reconnectHub(hub.hubName, hub.withAuth));
    }

    private reconnectHub(hub: string, withAuth: boolean) {
        this.online[hub] = false;
        if (this.rConnections[hub] && this.rConnections[hub].state === HubConnectionState.Connected) {
            this.rConnections[hub].stop().then(() => this.connectToHub(hub, withAuth));
        } else {
            this.connectToHub(hub, withAuth);
        }
    }

    // Check identity before access
    private connectToHub(hub: string, withAuth: boolean) {
        const url = this.apiUrl + hub;
        const authToken = this.tokenService.getAuthToken();

        this.rConnections[hub] = new HubConnectionBuilder()
            .withUrl(url, { accessTokenFactory: withAuth ? () => authToken : undefined, transport: HttpTransportType.WebSockets })
            .configureLogging(LogLevel.Information)
            .build();

        this.rConnections[hub].start()
            .then(() => {
                console.log(`Hub connected to '${hub}'`);
                this.online[hub] = true;
                this.refreshListeners(hub);
            })
            .catch((err) => {
                console.log(`Hub connection failed. ${err}`);
                this.online[hub] = false;
                setTimeout(() => this.reconnectHub(hub, withAuth), 10000);
            });

        this.rConnections[hub].onclose((err) => {
            console.log(`Hub connection closed. (err: ${err})`);
            if (this.online[hub]) {
                this.reconnectHub(hub, withAuth);
            }
        });
    }

    private refreshListeners(hub: string) {
        for (const hm in this.hubs[hub]) {
            if (this.hubs[hub].hasOwnProperty(hm)) {
                this.startListener(hub, hm);
            }
        }
    }

    private startListener(hub: string, hubMethod: string) {
        this.rConnections[hub].off(hubMethod);
        this.rConnections[hub].on(hubMethod, resp => this.hubs[hub][hubMethod].next(resp));
        console.log(`Hub listening: '${hub} ${hubMethod}'`);
    }

    private listenHub<T>(hub: string, hubMethod: string) {
        if (!this.hubs[hub]) {
            this.hubs[hub] = {};
        }
        if (!this.hubs[hub][hubMethod]) {
            this.hubs[hub][hubMethod] = new Subject<T>();
        }
        if (!this.online[hub]) {
            console.log(`Hub NOT listening (connection offline): '${hub} ${hubMethod}'`);
            return;
        }
        this.startListener(hub, hubMethod);
    }
}
