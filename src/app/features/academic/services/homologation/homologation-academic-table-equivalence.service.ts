import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Career, Homologacion } from './estudent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomologationAcademicTableEquivalenceService {
  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:5050/HomologationCarrera';

  getCareers(): Observable<Career[]> {
    return this.http.get<Career[]>(this.apiUrl);
  }

  getById(id: number): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrl}/${id}`);
  }

  private apiUrlHomologationHomologacion= 'http://localhost:5050/HomologationHomologacion';

  createHomologation(homologation: Homologacion): Observable<Homologacion> {
    return this.http.post<Homologacion>(this.apiUrlHomologationHomologacion, homologation);
  }
  getHomologations(): Observable<Homologacion[]> {
    return this.http.get<Homologacion[]>(this.apiUrlHomologationHomologacion);
  }
  deleteHomologation(id: number): Observable<Homologacion> {
    return this.http.delete<Homologacion>(`${this.apiUrlHomologationHomologacion}/Delete/${id}`);
  }
  getHomologatedSubjects(pensumIdOrigen: number, pensumIdDestino: number): Observable<Homologacion[]> {
    return this.http.get<Homologacion[]>(`${this.apiUrlHomologationHomologacion}/HomologatedSubjects/${pensumIdOrigen}/${pensumIdDestino}`);
  }
}
