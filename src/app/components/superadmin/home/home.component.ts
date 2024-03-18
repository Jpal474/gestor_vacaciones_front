import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  numero_solicitudes: Number = 0;
constructor(private superadService: SuperadService) {}

ngOnInit(): void {
  this.superadService.getNumeroSolicitudesAprobadas()
  .subscribe({
    next: (res: Number)=> {
      this.numero_solicitudes=res;
      this.generarSaldoVacacional();
    }
  })
}

async generarSaldoVacacional(){
  const hoy = moment( new Date(), 'YYYY-MM-DD')
  if(hoy.month() === 12 && hoy.date() >=15){
  this.superadService.generarSaldos()
  .subscribe({
    next: (res)=>{
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El Saldo Ha Sido Actualizado',
        confirmButtonColor:'#198754',
      }) 

    }
  })
}
}//fin de la funcion
}
