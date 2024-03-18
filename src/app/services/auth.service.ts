import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.interface';
import {JwtHelperService } from '@auth0/angular-jwt'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL:string='http://localhost:3000'
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) { }

  getAuth(correo:string, contrasenia:string): Observable<Login> {
    const body = { correo, contrasenia };
    console.log('peticion', correo, contrasenia);
    
      return this.httpClient.post<Login>(`${this.BASE_URL}/auth/signin`, body);
      
    }

  decodeUserFromToken(token: string) {
      return this.jwtHelper.decodeToken(token);
    }
    logOut(){
      localStorage.clear();
      this.router.navigate(['iniciar_sesion'])
      
  
      
    }

    enviarMail(destinatario: string): Observable<boolean>{
       return this.httpClient.post<boolean>(`${this.BASE_URL}/auth/email/${destinatario}`, {})
    }

    changePassword(id: string, contraseña: string){
      return this.httpClient.post<boolean>(`${this.BASE_URL}/auth/password/${id}`, {contraseña})
    }
  
}
