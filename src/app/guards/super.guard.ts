import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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
    if(tipo && tipo === 'SuperAdministrador'){
      return true;
    }
    else{
      this.router.navigate(['/pagenotfound'])
    return false;
  }
}
}

export const superGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsToken).canActivate();

};
