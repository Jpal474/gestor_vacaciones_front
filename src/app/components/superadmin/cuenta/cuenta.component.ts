import { Component } from '@angular/core';
import { Ceo } from 'src/app/interfaces/ceo.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {
  ceo = {} as Ceo 
constructor(
  private superadService: SuperadService,
  private storageService: StorageService
) {}

ngOnInit(): void {
  console.log('entra on-init');
  
  const id = this.storageService.getLocalStorageItem('id') + '';
  if(id){
  this.getUsuario(id);
}
}

getUsuario(id: string){
  console.log('entra if');
  
  this.superadService.getCeoByUserId(id)
  .subscribe({
    next: (res: Ceo)=>{
      if(res){
        console.log(res);
        
        this.ceo= res;
      }
    },
    error: (err)=>{
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'Hubo un error al obtener sus datos'
      })
      console.log(err);
      
    }
  })
}



}
