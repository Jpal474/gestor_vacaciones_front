import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit{
  solicitudes: Solicitud[] = []
  paginasArray: number[]=[];
  paginas = 0;
  pagina_actual=0
  opcion= 1;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private storageService: StorageService) {}

  ngOnInit(): void {
    this.getSolicitudes(1);
  }

  getSolicitudes(page:number){
    this.pagina_actual =page;
    this.adminService.getSolicitudesTrabajadores(5,page, this.opcion)
    .subscribe({
      next: (res: { solicitudes: Solicitud[]; pages: number })=> {
        this.solicitudes = res.solicitudes;
        this.paginas = res.pages;  
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
        if(this.solicitudes.length === 0){
          Swal.fire({
            icon: 'warning',
            title: 'No hay solicitudes por mostrar',
          })
        }      
      },
      error: (err)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha habido un error al obtener las solicitudes',
          confirmButtonColor:'#198754',
        })
      }
    })
  }

  colocarIdSolicitud(id: number |undefined){
this.storageService.setLocalStorageItem('id_solicitud', id!)
    this.router.navigate([`/admin/solicitud`]);

  }


  actualizarFiltro(opcion: string){
    this.opcion = parseInt(opcion)
    this.adminService.getSolicitudesTrabajadores(5,1,parseInt(opcion))
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
          confirmButtonColor:'#198754'
        })  
       console.log(err);
       
      },
    })
  }

}
