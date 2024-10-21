import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AcademicSubjetRelationService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:5050/RelationSubjects';

  createSubjectRelation(subjectRelation: any) {
    return this.http.post<any>(this.apiUrl, subjectRelation);
  }

  getSubjectRelation() {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteSubjectRelation(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }

  getSubjectRelationByStudentEmrollment(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/StudentEnrollment/${id}`);
  }
}
