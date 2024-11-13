import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Career } from './estudent';
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
}
