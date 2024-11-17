import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Career, Homologacion, Student, UpdatedStudent } from './estudent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomologationMateriasService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:5050/HomologationEstudiante';

  getPensumActual(id:number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/EstudiantePensumActual/${id}`);
  }

  getByIdEstudainte(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/Estudiante/${id}`);
  }

  updateEstudainte(student: UpdatedStudent): Observable<UpdatedStudent> {
    return this.http.post<UpdatedStudent>(this.apiUrl, student);
  }

  private apiUrlHomologationHomologacion= 'http://localhost:5050/HomologationCarrera';

  getHomologationSubjectbyId(id: number): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrlHomologationHomologacion}/${id}`);
  }

  private apiUrlHomologationHomologacionMateria= 'http://localhost:5050/HomologationHomologacion';

  getHomologatedSubjects(pensumIdOrigen: number, pensumIdDestino: number): Observable<Homologacion[]> {
    return this.http.get<Homologacion[]>(`${this.apiUrlHomologationHomologacionMateria}/HomologatedSubjects/${pensumIdOrigen}/${pensumIdDestino}`);
  }
}
