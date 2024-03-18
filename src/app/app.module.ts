import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralModule } from './components/general/general.module';
import { HomeComponent } from './components/superadmin/home/home.component';
import { SuperadminModule } from './components/superadmin/superadmin.module';
import { AdminModule } from './components/admin/admin/admin.module';
import { TrabajadoresModule } from './components/trabajadores/trabajadores.module';
import { CalendarioComponent } from './components/admin/calendario/calendario.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token.interceptor.service';
import { EditarSolicitudComponent } from './components/admin/editar-solicitud/editar-solicitud.component';
import { VerMisolicitudComponent } from './components/admin/ver-misolicitud/ver-misolicitud.component';
import { CuentaComponent } from './components/admin/cuenta/cuenta.component';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GeneralModule,
    SuperadminModule,
    AdminModule,
    TrabajadoresModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
