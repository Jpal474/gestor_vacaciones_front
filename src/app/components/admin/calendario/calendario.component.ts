import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { AdminService } from 'src/app/services/admin.service';
import { FestivosService } from 'src/app/services/festivos.service';
import * as moment from 'moment';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  dias: DiasFeriados[]=[]
  fecha = moment(new Date(), 'YYYY-MM-DD');
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionGridPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    events: [],
    eventClick: function(info) {
      alert(info.event.title);
     
    },
    validRange:{
      start: `${this.fecha.year()}-01-01`,
      end:`${this.fecha.year() + 1}-01-01`
    }
  };

  constructor(
    private adminService: AdminService,
    private feriadosService: FestivosService) {}

  ngOnInit(): void {
    let events:any;
    this.feriadosService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          events = this.dias.map( event => {
            let color;
            if (event.type === 'public' &&  event.name.includes('libre')) {
              console.log('libre');
              
              color = '#007ad9'; // Set the color for events of Type1
            } else if (event.type === 'bank') {
              color = '#330036'; // Set the color for events of Type2
            } else if (event.type === 'observance') {
              color = '#2F4858'; // Set the color for events of Type3
            }  else if (event.type === 'public'){
              color = '#27a082'; // Set the color for events of Type3
            } 
            return {
              title: event.name,
              date: event.date.toString().split(' ')[0],
              backgroundColor: color,
            };
          }
            
            );
          
        }
      },
      error: (err) => {
        const cadena:string = 'unknown error'
        if(cadena.includes(err)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha habido un error al completar la solicitud',
            confirmButtonColor: '',
          })
        }
        else if('unauthorized'.includes(err)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe iniciar sesión para completar la acción',
            confirmButtonColor:'#198754',
          })
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
          confirmButtonColor:'#198754'
        })
      },
      complete: () => {
        this.adminService.getSolicitudesAprobadas()
        .subscribe({
          next: (res: Solicitud[])=> {
            console.log(res);
            
           events = [
            ...events,
           ...res.map( event => ({title: `Vacaciones ${event.empleado.nombre}`, start: moment(event.fecha_inicio, '').format('YYYY-MM-DD'), end: moment( event.fecha_fin, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'), backgroundColor:'#378006'})),
            ]; 
            console.log(events);
            
          this.calendarOptions = {
            events: events
          }

          },
          error: (err)=> {
            const cadena:string = 'unknown error'
          if(cadena.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha habido un error al completar la solicitud',
              confirmButtonColor:'#198754',
            })
          }
          else if('unauthorized'.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debe iniciar sesión para completar la acción',
              confirmButtonColor:'#198754'
            })
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
            confirmButtonColor:'#198754'
          })
          },
        })
      }
    })
    
  }

  }



