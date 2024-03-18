import { CanActivateFn } from '@angular/router';

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn:'root'
})
class PermissionsToken {
  constructor(
    private router:Router 
    ){

  }
  canActivate(): boolean {
    if(localStorage.getItem('token')){
      return true;
    }
    else{
    this.router.navigate(['/iniciar_sesion'])
    Swal.fire({
      icon: 'warning',
      text: 'Su Sesión Ha Expirado, Inicie Sesión De Nuevo',
    })
    return false;
  }
}
}


export const authGuard: CanActivateFn = (route:  ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsToken).canActivate();
};
