import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicSourceUnitService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5050/SourceUnit';

  createUnit(unit: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, unit);
  }

  getUnit(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

}
