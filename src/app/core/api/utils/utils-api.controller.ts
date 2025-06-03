import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UtilsApi {
    _baseUrl: string = `${environment.api}/guest/utils`;

    constructor(private http: HttpClient) {}

    departaments(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/departaments`);
    }
}