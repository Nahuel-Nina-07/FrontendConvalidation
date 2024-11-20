import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Career, Homologacion, MateriaHomologada, MateriaNoHomologada, MateriasAprobadas, MateriasHomologadas, MateriasHomologadasResponse, MateriasNoHomologadasResponse, Student, UpdatedStudent } from './estudent';
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

  private apiUrlMateriasNoHomologadas= "http://localhost:5050/MateriaNoHomologada"

  createMateriaNoHomologada(materiaNoHomologada:MateriaNoHomologada):Observable<MateriaNoHomologada>{
    return this.http.post<MateriaNoHomologada>(this.apiUrlMateriasNoHomologadas,materiaNoHomologada)
  }

  getAllMateriaNoHomologada(): Observable<MateriaNoHomologada[]> {
    return this.http.get<MateriaNoHomologada[]>(this.apiUrlMateriasNoHomologadas);
  }

  getbyhomologationEstudiantePensumId(id: number): Observable<MateriasNoHomologadasResponse[] > {
    return this.http.get<MateriasNoHomologadasResponse[] >(`${this.apiUrlMateriasNoHomologadas}/EstudiantePensum/${id}`);
  }
  
  private apiUrlMateriasHomologadas= "http://localhost:5050/HomologationMateriaHomologacion"

  createMateriaHomologada(materiaHomologada:MateriaHomologada):Observable<MateriaHomologada>{
    return this.http.post<MateriaHomologada>(this.apiUrlMateriasHomologadas,materiaHomologada)
  }

  getAllMateriaHomologada(): Observable<MateriaHomologada[]> {
    return this.http.get<MateriaHomologada[]>(this.apiUrlMateriasHomologadas);
  }

  getByIdMateriaHomologada(id: number): Observable<MateriaHomologada> {
    return this.http.get<MateriaHomologada>(`${this.apiUrlMateriasHomologadas}/${id}`);
  }

  getbyhomologationEstudianteId(id: number): Observable<MateriasHomologadasResponse[] > {
    return this.http.get<MateriasHomologadasResponse[] >(`${this.apiUrlMateriasHomologadas}/EstudiantePensum/${id}`);
  }

  private apiUrlHomologationMaterias= 'http://localhost:5050/HomologationMateriaAprobada';

  createMateriaAprobada(materiaAprobada:MateriasAprobadas):Observable<MateriasAprobadas>{
    return this.http.post<MateriasAprobadas>(this.apiUrlHomologationMaterias,materiaAprobada)
  }
}
