import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RecuperarContraseniaComponent } from './recuperar-contrasenia/recuperar-contrasenia.component';
import { ActualizarContraseniaComponent } from './actualizar-contrasenia/actualizar-contrasenia.component';
import { Header2Component } from './shared/header2/header2.component';




@NgModule({
  declarations: [
    LandingComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PagenotfoundComponent,
    RecuperarContraseniaComponent,
    ActualizarContraseniaComponent,
    Header2Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class GeneralModule { }
