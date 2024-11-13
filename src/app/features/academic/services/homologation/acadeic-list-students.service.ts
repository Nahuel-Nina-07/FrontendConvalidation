import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './estudent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcadeicListStudentsService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:5050/HomologationEstudiante';

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }
}
