import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityOriginService {
  private apiUrl = 'http://localhost:5050/UniversityOrigin';

  private apiUrlCity = 'http://localhost:5050/City';

  constructor(private http: HttpClient) {}

  createUniversityOrigin(university: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, university);
  }

  getUniversityOrigins(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCity(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCity);
  }

  deleteUniversityOrigin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

  getUniversityByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${name}`);
  }

  updateUniversityOrigin(university: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, university);
  }
}
