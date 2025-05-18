import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class GuestApi {
    _baseUrl: string = `${environment.api}/guest`;

    constructor(private http: HttpClient) { }

    login(loginCommand: any): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/auth/login`, loginCommand);
    }

    createJUser(command: any): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/user/create`, command);
    }

    findAll(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/find`);
    }

    history(): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/history`)
    }

    private edit(id: string, command: any): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/edit/${id}`, command);
    }

    private create(command: any): Observable<any> {
        return this.http.post<any>(`${this._baseUrl}/save`, command);
    }

    save(command: any): Observable<any> {
        return command.id == null ? this.create(command) : this.edit(command.id, command);
    }

    findById(id: string): Observable<any> {
        return this.http.get<any>(`${this._baseUrl}/find/${id}`);
    }

    announced(id: string): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/announced/${id}`, null)
    }

    unread(id: string): Observable<any> {
        return this.http.put<any>(`${this._baseUrl}/unread/${id}`, null);
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>(`${this._baseUrl}/delete/${id}`);
    }

    export(): Observable<any> {
        return this.http.get(`${this._baseUrl}/export`, { responseType: 'blob' });
    }

    sectors(): Observable<any> {
        return this.http.get(`${this._baseUrl}/utils/sectors`);
    }

    departments(): Observable<any> {
        return this.http.get(`${this._baseUrl}/utils/departments`);
    }
}