import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DecodedJwt {
    constructor() { }

    decodeJWT = (token: string) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace("-", "+").replace("_", "/");
            var json = JSON.parse(window.atob(base64));
            console.log('json', json);
            return json;
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    }
}