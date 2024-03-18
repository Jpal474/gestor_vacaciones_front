import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SolicitudEmpleado } from 'src/app/interfaces/solicitud-empleado';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: SolicitudEmpleado[] = [] 
  empleado_id='';
  opcion =1;
  paginas = 0;
  paginasArray: number[]=[];
  pagina_actual = 1;

  constructor(
    private trabajadorService: TrabajadoresService,
    private router: Router,
    private storageService: StorageService
    ) {}

  ngOnInit(): void {
    let id = this.storageService.getLocalStorageItem('id') + '';
    console.log(id);
    
    if (id){
      this.trabajadorService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            this.empleado_id=res.id;
            console.log(res);
           this.trabajadorService.getSolicitudes(res.id, 5,1, this.opcion)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
              if(!(this.solicitudes)){
                Swal.fire({
                  icon: 'warning',
                  title: 'No Hay Solicitudes Por Mostrar',
                  confirmButtonColor:'#198754',
                }) 

              }
                
              }
           })
          
          }

        }
      })
    }
    
  }

  getSolicitudes(pagina:number){
    this.pagina_actual = pagina
    this.trabajadorService.getSolicitudes(this.empleado_id, 5,pagina, this.opcion)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
              if(!(this.solicitudes)){
                Swal.fire({
                  icon: 'warning',
                  title: 'No Hay Solicitudes Por Mostrar',
                  confirmButtonColor:'#198754',
                }) 

              }
                
              }
           })
  }

  colocarIdSolicitud(id: number |undefined, opcion: number){
    this.storageService.setLocalStorageItem('id_solicitud', id!)
    if(opcion===1){
      this.router.navigate([`/trabajador/solicitud`]);
    }
    else if(opcion === 2){
      this.router.navigate([`/trabajador/editar_solicitud`]);
    }

  }

  actualizarFiltro(opcion: string){
    this.opcion = parseInt(opcion)
    this.trabajadorService.getSolicitudes(this.empleado_id,5,1,parseInt(opcion))
    .subscribe({
      next: (res:{ solicitudes: Solicitud[]; pages: number })=> {
        console.log(res);
        
        this.solicitudes=res.solicitudes;
        this.paginas = res.pages;
          this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
      },
      error(err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al obtener las solicitudes',
        })  
        console.log(err);
        
       
      },
    })
  }

}
