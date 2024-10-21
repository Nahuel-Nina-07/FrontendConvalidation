import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectOriginService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5050/SourceSubject';
  private unitsUrl = 'http://localhost:5050/Units';

  private subjectUrl = 'http://localhost:5050/Subjects';


  createSubject(subject: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, subject);
  }

  getSubject(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

  getSubjectByCareer(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Career/${id}`);
  }

  //Units
  getUnits(): Observable<any[]> {
    return this.http.get<any[]>(this.unitsUrl);
  }

  //Subjects
  getSubjectsUAB(): Observable<any[]> {
    return this.http.get<any[]>(this.subjectUrl);
  }
}
