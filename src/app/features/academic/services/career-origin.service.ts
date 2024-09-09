import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerOriginService {
  private apiUrl = 'http://localhost:5050/OriginCareer';  // Ajusta la URL según corresponda

  constructor(private http: HttpClient) {}

  createCareer(career: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, career);
  }

  getCareers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteCareer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

  updateCareer(career: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, career); // Usar POST para actualizar también
  }
}
