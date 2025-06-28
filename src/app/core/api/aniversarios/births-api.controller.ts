import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BirthsApi {
    _baseUrl: string = `${environment.api}/guest/births`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}`);
    }

    getWeek(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/birthdays-week`)
    }

    save(command: any): Observable<any> {
        return this.create(command);
    }

    private create(command: any): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/save`, command);
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>(`${this._baseUrl}/delete/${id}`);
    }
}