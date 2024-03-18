import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { VerSolicitudComponent } from './ver-solicitud/ver-solicitud.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgregarEmpleadoComponent } from './agregar-empleado/agregar-empleado.component';
import { EditarEmpleadoComponent } from './editar-empleado/editar-empleado.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentaComponent } from './cuenta/cuenta.component';
import { EditarCuentaComponent } from './editar-cuenta/editar-cuenta.component';



@NgModule({
  declarations: [
    HomeComponent,
    SuperadminComponent,
    NavbarComponent,
    DepartamentosComponent,
    SolicitudesComponent,
    VerSolicitudComponent,
    CalendarioComponent,
    EmpleadosComponent,
    AgregarEmpleadoComponent,
    EditarEmpleadoComponent,
    CuentaComponent,
    EditarCuentaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FullCalendarModule,
  ]
})
export class SuperadminModule { }
