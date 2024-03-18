import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SolicitudEmpleado } from 'src/app/interfaces/solicitud-empleado';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent {

  solicitudes: SolicitudEmpleado[] = [] 
  paginas = 0;
  paginasArray: number[]=[]; 
  empleado_id = '';
  pagina_actual = 1;
  opcion=1;

  constructor(
    private adminService: AdminService,
    private storageService: StorageService,
    private router: Router) {}

  ngOnInit(): void {
    let id = this.storageService.getLocalStorageItem('id') + '';
    if (id){
      this.adminService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            this.empleado_id = res.id;
            console.log(res);
           this.adminService.getMisSolicitudes(res.id, 5,1, this.opcion)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                console.log(res);
                
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
              if(this.solicitudes.length === 0){
                Swal.fire({
                  icon: 'warning',
                  title: 'No Hay Solicitudes Por Mostrar',
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
    this.pagina_actual = pagina;
    this.adminService.getMisSolicitudes(this.empleado_id, 5,pagina, this.opcion)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
              if(!(this.solicitudes)){
                Swal.fire({
                  icon: 'warning',
                  title: 'No Hay Solicitudes Por Mostrar',
                }) 
              }
              },
              error: (err)=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al traer sus solicitudes',
          })
        
          
              }
           })
  }

  colocarIdSolicitud(id: number |undefined, opcion: number){
this.storageService.setLocalStorageItem('id_solicitud', id!)

    if(opcion===1){
      this.router.navigate([`/admin/mi_solicitud`]);
    }
    else if(opcion === 2){
      this.router.navigate([`/admin/editar_solicitud`]);
    }

  }

  actualizarFiltro(opcion: string){
    this.opcion = parseInt(opcion)
    this.adminService.getMisSolicitudes(this.empleado_id,5,1,parseInt(opcion))
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
          text: 'Hubo un error al obtener sus solicitudes',
        })  
       console.log(err);
       
      },
    })
  }
}
