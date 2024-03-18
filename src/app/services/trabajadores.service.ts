import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { Empleado } from '../interfaces/empleados.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { SaldoVacacional } from '../interfaces/saldo_vacacional.interface';
import { SolicitudCrear } from '../interfaces/crear_solicitud.interface';
import { SolicitudEditar } from '../interfaces/solicitud-editar.interface';
import { EmailTrabajadores } from '../interfaces/email_trabajadores.interface';
import { SaldoActualizado } from '../interfaces/actualizar_saldo-vacacional.interface';


@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

BASE_URL: string='http://localhost:3000';
headers= new HttpHeaders({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});
  constructor(private httpClient: HttpClient) { }

  getEmpleadoByUserId(id: string): Observable<Empleado>{
    return this.httpClient.get<Empleado>(`${this.BASE_URL}/empleado/usuario/${id}`)
  }
  
  getSolicitudes(id: string, size:number, page:number, opcion: number): Observable<{ solicitudes: Solicitud[]; pages: number }>{
    return this.httpClient.get<{ solicitudes: Solicitud[]; pages: number }>(`${this.BASE_URL}/solicitud/empleados/${id}/${size}/${page}/${opcion}`)
  }

  getSolicitudById(id: number): Observable<Solicitud>{
    return this.httpClient.get<Solicitud>(`${this.BASE_URL}/solicitud/${id}`);
  }

  getSolicitudesAprobadasByEmpleadoId(id: string): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/aprobadas/${id}`);
  }
  

  getSaldoByEmpleadoId(id: string, anio: number){
    console.log('id', id);
    console.log('año', anio);
    
    return this.httpClient.get<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`)

  }

  getMails(): Observable<string[]>{
    return this.httpClient.get<string[]>(`${this.BASE_URL}/usuario/correos/1`)
  }

  enviarMail(email: EmailTrabajadores): Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.BASE_URL}/trabajador/email`, email);
  }

  createSolicitud(solicitud: SolicitudCrear): Observable<Solicitud>{
  return this.httpClient.post<Solicitud>(`${this.BASE_URL}/solicitud`, solicitud)
  }

  updateSolicitud(id: number, solicitud: SolicitudEditar): Observable<Solicitud>{
    return this.httpClient.put<Solicitud>(`${this.BASE_URL}/solicitud/${id}`, solicitud);
  }

  updateSaldoVacacional(id: string, anio: number, saldoActualizado: SaldoActualizado): Observable<SaldoVacacional>{
    return this.httpClient.put<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`, saldoActualizado)
  }


}
