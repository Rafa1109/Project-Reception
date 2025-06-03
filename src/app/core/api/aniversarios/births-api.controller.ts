import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BirthsApi {
    _baseUrl: string = `${environment.api}/guest/births`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}`);
    }

    getWeek(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/birthdays-week`)
    }

    save(command: any): Observable<any> {
        return command.id == null ? this.create(command) : this.update(command.id, command);
    }

    private create(command: any): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/save`, command);
    }

    private update(id:string, command: any): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/edit/${id}`, command);
    }
}