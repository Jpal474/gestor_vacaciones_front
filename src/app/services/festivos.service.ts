import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';

@Injectable({
  providedIn: 'root'
})
export class FestivosService {
  FESTIVOS_URL= 'https://api.generadordni.es/v2/holidays/holidays?country=MX&year='
  constructor(private httpClient: HttpClient) { }

  getDiasFeriados(): Observable<DiasFeriados[]>{
    const año = new Date().getFullYear()
    
    const date = new Date();
    const year = date.getFullYear();
    return this.httpClient.get<any>(this.FESTIVOS_URL + año);
  }
}
