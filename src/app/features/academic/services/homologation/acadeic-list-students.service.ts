import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomologationPensumEstudent, Student } from './estudent';
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

  getPensumActual(id:number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/EstudiantePensumActual/${id}`);
  }

  private apiUrlHomologationHomologacion= 'http://localhost:5050/HomologationEstudiantePensum';

  getHomologationSubjectbyId(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrlHomologationHomologacion}/${id}`);
  }

  createHomologationSubject(homologation: HomologationPensumEstudent): Observable<HomologationPensumEstudent> {
    return this.http.post<HomologationPensumEstudent>(this.apiUrlHomologationHomologacion, homologation);
  }

  getGetByIdEstudiantePensum(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrlHomologationHomologacion}/GetByIdEstudiantePensum/${id}`);
  }

  deletePensum(id: number): Observable<HomologationPensumEstudent> {
    return this.http.delete<HomologationPensumEstudent>(`${this.apiUrlHomologationHomologacion}/Delete/${id}`);
  }
}
