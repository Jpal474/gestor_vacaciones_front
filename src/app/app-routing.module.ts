import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/general/login/login.component';
import { LandingComponent } from './components/general/landing/landing.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { ADMIN_ROUTES } from './components/admin/admin/admin.routes';
import { SuperadminComponent } from './components/superadmin/superadmin/superadmin.component';
import { SUPERADMIN_ROUTES } from './components/superadmin/superadmin/superadmin.routes';
import { TrabajadorComponent } from './components/trabajadores/trabajador/trabajador.component';
import { TRABAJADOR_ROUTES } from './components/trabajadores/trabajador/trabajador.routes';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { superGuard } from './guards/super.guard';
import { trabajadorGuard } from './guards/trabajador.guard';
import { PagenotfoundComponent } from './components/general/pagenotfound/pagenotfound.component';
import { RecuperarContraseniaComponent } from './components/general/recuperar-contrasenia/recuperar-contrasenia.component';
import { ActualizarContraseniaComponent } from './components/general/actualizar-contrasenia/actualizar-contrasenia.component';
import { sesionGuard } from './guards/sesion.guard';

const routes: Routes = [
  {path:'inicio', component: LandingComponent, canActivate: [sesionGuard]},
  { path: 'iniciar_sesion', component: LoginComponent },
  {path:'admin', component:AdminComponent, canActivate:[authGuard, adminGuard], children:ADMIN_ROUTES},
  {path:'super', component:SuperadminComponent,canActivate:[authGuard, superGuard], children:SUPERADMIN_ROUTES},
  {path:'trabajador', component:TrabajadorComponent, canActivate:[authGuard, trabajadorGuard] ,children:TRABAJADOR_ROUTES},
  {path:'confirmar_cambio_contrasenia', component:RecuperarContraseniaComponent},
  {path:'cambiar_contra/:token', component:ActualizarContraseniaComponent},
  {path: 'paginanoencontrada', component: PagenotfoundComponent},
  {path:'**', pathMatch:'full', redirectTo:'paginanoencontrada'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
