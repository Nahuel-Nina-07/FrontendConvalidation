import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private readonly _http = inject(HttpClient)

  getAllContracto(): Observable<any> {
    return this._http.get('http://soyuab.uab.edu.bo:9092/comidas')
  }
}
