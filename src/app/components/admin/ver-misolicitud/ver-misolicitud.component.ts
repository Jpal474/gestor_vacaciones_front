import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AprobarSolicitud } from 'src/app/interfaces/aprobar_solicitud.interface';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { RechazarSolicitud } from 'src/app/interfaces/rechazar_solicitud.interface';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { FestivosService } from 'src/app/services/festivos.service';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import { StorageService } from 'src/app/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-misolicitud',
  templateUrl: './ver-misolicitud.component.html',
  styleUrls: ['./ver-misolicitud.component.css']
})
export class VerMisolicitudComponent {
  dias: Number[] = [];
  dias2: Number[]=[];
  band: boolean=false;
  band_anio: boolean = false;
  dias_festivos: string [] = [];
  fechas={
    mes: '',
    mes2:'',
    anio: '',
    anio2:'',
  }
  nombre_rechazar:RechazarSolicitud = {
    nombre: '',
  }
  nombre_aceptar: AprobarSolicitud={
    nombre: '',
  }
  reglas: string [] = ["01-01", "1st monday in Frebruary", "3rd monday in March", "05-01","09-16", "3rd monday in November", "12-01 every 6 years since 1934", "12-25" ];
  solicitud: Solicitud = {
    id: 0,
    fecha_inicio: '',
    fecha_fin: '',
    fecha_creacion: '',
    estado: SolicitudEstado.PENDIENTE,
    justificacion: '',
    aprobada_por: '',
    denegada_por: '',
    empleado: {
      id: '',
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
      usuario: {
        nombre_usuario: '',
        correo: '',
      },
      departamento: {
        id: 0,
        nombre: '',
      },
    },
  }
  constructor(
    private trabajadorService: TrabajadoresService,
    private activadedRoute: ActivatedRoute,
    private festivosService: FestivosService,
    private storageService: StorageService
    ) {}

  ngOnInit(): void {
    const id_solicitud = +this.storageService.getLocalStorageItem('id_solicitud')!
    
    if (id_solicitud) {
      this.trabajadorService.getSolicitudById(id_solicitud).subscribe({
        next: (res: Solicitud) => {
          this.solicitud = res;
          console.log(this.solicitud);
        },
        error: (err)=> {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cargar la solicitud',
            confirmButtonColor:'#198754',
          })
          console.log(err);
          
        },
        complete: ()=>{
          this.festivosService.getDiasFeriados()
          .subscribe({
            next: (res: DiasFeriados[])=> {
              let i = 0;
              if(res){
                 res.map(event =>{
                   if(event.type === 'public' && this.reglas.includes(event.rule)){
                    this.dias_festivos[i] = moment(event.date).format('YYYY-MM-DD')
                    i++;
                   }
                }); 
                console.log(this.dias_festivos);
                this.getDias(this.solicitud.fecha_inicio, this.solicitud.fecha_fin);
                
              }
            },
            error: (err)=> {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al obtener los días festivos',
            confirmButtonColor:'#198754'
          })
          console.log(err);
          
              
            }
          }) 
        }
      });
    }
  }

  getDias(fecha_inicio: string, fecha_fin: string) {
    const fechaInicio = moment(fecha_inicio, 'YYYY-MM-DD');
    const fechaFinal = moment(fecha_fin, 'YYYY-MM-DD');
    const anio = fechaInicio.year();
    const anio2 = fechaFinal.year();
    
    
    let fecha_actual = fechaInicio.clone();
    let i= 0;
    while (fecha_actual.isSameOrBefore(fechaFinal, 'day')) {      
      // Verificar si el día actual no es sábado (6) ni domingo (0)
      console.log(i);
      if (fecha_actual.day() !== 6 && fecha_actual.day() !== 0) {
        const fechaActualString = fecha_actual.format('YYYY-MM-DD');
        console.log(this.dias_festivos)
        console.log(fechaActualString, '-----------',this.dias_festivos.includes(fechaActualString));
        
        if (!this.dias_festivos.includes(fechaActualString)) {
          if(i<1){
            this.dias.push(fecha_actual.date());
            console.log('entra al while');
            }
          else{
            if (
              fecha_actual.date() == 1 &&
              (fechaInicio.month() < fechaFinal.month() ||
                (fecha_actual.date() == 2 &&
                  fechaInicio.month() < fechaFinal.month()))
            ){
              this.dias2.push(fecha_actual.date())
              this.band = true;
            }
            else if (!this.band) {
                this.dias.push(fecha_actual.date())
            }
            else{
              this.dias2.push(fecha_actual.date())
            }
          }
        } else {
          console.log('Día feriado');
        }
      }
      i+=1;
      // Avanzar al siguiente día
      console.log('salida de while');
      
      fecha_actual.add(1, 'day');
    }
    i=0;
    if(anio < anio2){ //si anio2 es mayor a anio, significa que habrá 2 nios
      this.band_anio= true;
      console.log(fechaInicio);
      console.log(fechaFinal);
      console.log('------');
    
       this.fechas.anio = anio.toString();
       this.fechas.anio2 = anio2.toString();
       const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
       const DATEMOMENT2 = moment(fechaFinal, 'YYYY-MM-DD').format('MMMM');
       this.fechas.mes = this.traducirMes(DATEMOMENT);
       this.fechas.mes2 = this.traducirMes(DATEMOMENT2);
    }
    else if (this.dias2.length > 0){
      console.log('entra 2 meses');
      
      this.fechas.anio = anio.toString()
      const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes = this.traducirMes(DATEMOMENT);
      const DATEMOMENT2 = moment(fecha_fin, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes2 = this.traducirMes(DATEMOMENT2);
    }
    else{
      this.fechas.anio = anio.toString();
      const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes = this.traducirMes(DATEMOMENT);
    }
    console.log(this.fechas);
    console.log(this.dias);
    console.log(this.dias2);  
  }

  traducirMes(mes: string): string{
    let mes_español='';
   switch(mes){
     case 'January': 
     mes_español = 'Enero';
     break;
     case 'February': 
     mes_español = 'Febrero';
     break;
     case 'March':
       mes_español = 'Marzo';
       break;
     case 'April':
       mes_español = 'Abril';
       break;
     case 'May':
       mes_español = 'Mayo';
       break;
      case 'June':
       mes_español = 'Junio';
       break;
      case 'July':
       mes_español = 'Julio';
       break;
       case 'August':
         mes_español = 'Agosto';
         break;
       case 'September':
         mes_español = 'Septiembre';
         break;
       case 'October':
         mes_español = 'Octubre';
         break;
       case 'November':
         mes_español = 'Noviembre';
         break;
       case 'December':
         mes_español = 'Diciembre' ;
         break;
       default:
         console.log('Opcion No Reconocida');
         break;
         
   }
   return mes_español
 }
}
