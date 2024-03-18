import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { SuperadService } from 'src/app/services/superad.service';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { FestivosService } from 'src/app/services/festivos.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import * as moment from 'moment';
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
      alert('Evento: ' + info.event.title);
    },
    validRange:{
      start: `${this.fecha.year()}-01-01`,
      end:`${this.fecha.year() + 1}-01-01`
    }
  };

  constructor(
    private superadService: SuperadService,
    private festivosService: FestivosService) {}

  ngOnInit(): void {
    let events:any;
    const año = new Date().getFullYear()
    this.festivosService.getDiasFeriados().
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
          });
          
        }
      },
      error: (err) => {
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'Hubo un error al obtener los días feriados',
          confirmButtonColor:'#198754',
        })
      },
      complete: () => {
        this.superadService.getSolicitudesAprobadas()
        .subscribe({
          next: (res: Solicitud[])=> {
           events = [
            ...events,
           ...res.map( event => ({title: `Vacaciones ${event.empleado.nombre}`, start: moment(event.fecha_inicio, 'YYYY-MM-DD').format('YYYY-MM-DD'), end: moment( event.fecha_fin, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'), backgroundColor:'#378006'})),
            ]; 
            console.log(events);
            
          this.calendarOptions = {
            events: events
          }

          }
        })
      }
    })
    
  }

}
