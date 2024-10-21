import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5050/StudentEnrollment';

  createStudentEnrollment(studentEnrollment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, studentEnrollment);
  }

  getStudentEnrollment(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteStudentEnrollment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

  
}
