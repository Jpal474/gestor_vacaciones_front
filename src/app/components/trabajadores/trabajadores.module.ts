import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { VerSolicitudComponent } from './ver-solicitud/ver-solicitud.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    TrabajadorComponent,
    NavbarComponent,
    SolicitudesComponent,
    CrearSolicitudComponent,
    EditarSolicitudComponent,
    CalendarioComponent,
    CuentaComponent,
    VerSolicitudComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule,
    ReactiveFormsModule,
  ]
})
export class TrabajadoresModule { }
