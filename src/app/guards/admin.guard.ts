import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn:'root'
})
class PermissionsToken {
  constructor(
    private router:Router,
    private storageService: StorageService
    ){

  }
  canActivate(): boolean {
    let tipo = this.storageService.getLocalStorageItem('tipo') + '';
    if(tipo && tipo === 'Administrador'){
      return true;
    }
    else{
      this.router.navigate(['/pagenotfound'])
    return false;
  }
}
}



export const adminGuard: CanActivateFn = (route:  ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsToken).canActivate();
};
