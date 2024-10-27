import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CareerOrigin, SourceSubject, Subject, SourceUnit, Units, UnitConvalidation} from '../views/academic-units/dataOrigin.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicUnitsService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:5050/Units';
  private CareerUrl = 'http://localhost:5050/OriginCareer';
  private SourceSubjectUrl = 'http://localhost:5050/SourceSubject';
  private SubjectUrl = 'http://localhost:5050/Subjects';
  private SourceUnitUrl = 'http://localhost:5050/SourceUnit';
  private unitConvalidationUrl = 'http://localhost:5050/UnitConvalidation';

  getUnits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUnitBySubject(id: number): Observable<Units[]> {
    return this.http.get<Units[]>(`${this.apiUrl}/${id}`);
  }

  getCareerById(id: number): Observable<CareerOrigin> {
    return this.http.get<CareerOrigin>(`${this.CareerUrl}/${id}`);
  }

  getSourceSubjectById(id: number): Observable<SourceSubject> {
    return this.http.get<SourceSubject>(`${this.SourceSubjectUrl}/${id}`);
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.SubjectUrl}/${id}`);
  }

  getSourceUnitBySourceSubject(id: number): Observable<SourceUnit[]> {
    return this.http.get<SourceUnit[]>(`${this.SourceUnitUrl}/Subject/${id}`);
  }

  createUnitConvalidation(unitConvalidation: UnitConvalidation): Observable<any> {
    return this.http.post<any>(this.unitConvalidationUrl, unitConvalidation);
  }

}
