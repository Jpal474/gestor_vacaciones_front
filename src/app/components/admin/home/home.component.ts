import { Component } from '@angular/core';
import * as moment from 'moment';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  numero_solicitudes: Number = 0;
  vacaciones = false;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getSolicitudesPendientesTrabajadores()
    .subscribe({
      next: (res: Number)=> {
        this.numero_solicitudes=res;
        this.generarAlerta()
      },
      error: (err)=> {
        Swal.fire({
          icon:'error',
          title: 'Error',
          text: 'Hubo un error al obtener el numero de solicitudes pendientes'
        }),
        console.log(err);
        
      }
    })
  }
  
  generarAlerta(){
    const fecha = moment(new Date()).format('YYYY-MM-DD').split('-')
    const dia = parseInt(fecha[2]);
    const mes = fecha[1];
    console.log('dia', dia);
    console.log('mes', mes);
    if(mes== '09' && (dia>= 29 && dia<=31))
    this.vacaciones = true
  }

}
