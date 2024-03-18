import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn:'root'
})
class PermissionsToken {
  constructor(
    private router:Router,
    private storageService: StorageService,
    ){

  }
  canActivate(): boolean {
    console.log(localStorage.getItem('token'), 'token');
    
    if(localStorage.getItem('token') != null){
      console.log('entra a tipo');
      
    let tipo = this.storageService.getLocalStorageItem('tipo') + '';
  
        if(tipo === 'SuperAdministrador'){
         this.router.navigate(['super/inicio'])
        }
        else if(tipo === 'Administrador'){
         this.router.navigate(['admin/inicio'])
        }
        else if (tipo === 'Trabajador'){
         this.router.navigate(['trabajador/inicio'])
        }
      return false;
    }
    else{
      return true;
  }
}
}

export const sesionGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsToken).canActivate();
};
