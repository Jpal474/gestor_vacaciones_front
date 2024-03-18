import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SuperadService } from 'src/app/services/superad.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = []
  paginas = 0;
  paginasArray: number[]=[];
  pagina_actual = 0;
  opcion = 1;
  constructor(
    private superadService: SuperadService,
    private router: Router,
    private storageService: StorageService,
    ) {}

  ngOnInit(): void {
    this.getSolicitudes(1);
  }

  getSolicitudes(page:number){
    this.pagina_actual = page;
    this.superadService.getAllSolicitudes(5,page,this.opcion)
    .subscribe({
      next: (res:{ solicitudes: Solicitud[]; pages: number })=> {
        this.solicitudes=res.solicitudes;
        this.paginas = res.pages;
          this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
      },
      error(err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener las solicitudes',
        })  
       console.log(err);
       
      },
    })

  }

  colocarIdSolicitud(id: number |undefined){
      this.storageService.setLocalStorageItem('id_solicitud', id!)
      this.router.navigate([`/super/solicitud`]);

  }

  actualizarFiltro(opcion: string){
    this.opcion = parseInt(opcion)
    this.superadService.getAllSolicitudes(5,1,parseInt(opcion))
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
