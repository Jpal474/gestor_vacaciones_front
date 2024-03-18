import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SuperadService } from 'src/app/services/superad.service';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-contrasenia',
  templateUrl: './actualizar-contrasenia.component.html',
  styleUrls: ['./actualizar-contrasenia.component.css']
})
export class ActualizarContraseniaComponent {
  fieldTextType:boolean=false;
  fieldTextType2:boolean=false;
  contrasenia_formulario!: FormGroup
  mensaje=''


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activadedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  crearFormulario(){
    this.contrasenia_formulario= this.fb.group({
      contraseña: ['', [Validators.minLength(8), Validators.maxLength(15), this.notOnlyWhitespace]],
      confirmar_contraseña: [''],
    })
  }

  guardar(){
    const params = this.activadedRoute.snapshot.params;
    const token = this.decrypt(decodeURIComponent(params['token']));
    this.authService.changePassword(token.id, this.contrasenia_formulario.value['contraseña'])
    .subscribe({
      next: (res: boolean)=> {
        if(res){
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Su contraseña ha sido actualizada',
            confirmButtonColor:'#198754',
          }) 
          
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar la contraseña',
            confirmButtonColor:'#198754',
          }) 
          
          
        }
        
      },
      error: (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar la contraseña',
          confirmButtonColor:'#198754',
        }) 
        console.log(err);
        
        
      }
    })

  }

  public decrypt(stringName: string){
    if (stringName) {
      const BYTES = CryptoJS.AES.decrypt(
        stringName,
        'claveSecreta',
      );
      const ORIGINALSTRING = BYTES.toString(CryptoJS.enc.Utf8);
      const jsonObject = JSON.parse(ORIGINALSTRING);
      return jsonObject;
    } else {
      return undefined;
    }
  }

  notOnlyWhitespace(control: AbstractControl) {
    if (control.value !== null && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    }
    return null;
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  get contraseniaNoValido() {
    this.mensaje = '';
    if (
      this.contrasenia_formulario.get('contraseña')?.errors?.['required'] &&
      this.contrasenia_formulario.get('contraseña')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (
      this.contrasenia_formulario.get('contraseña')?.errors?.[
        'notOnlyWhitespace'
      ] &&
      this.contrasenia_formulario.get('contraseña')?.touched
    ) {
      this.mensaje = 'El campo no puede consistir sólo en espacios en blanco';
    } else if (
      this.contrasenia_formulario.get('contraseña')?.errors?.['minlength']
    ) {
      this.mensaje = 'La contraseña debe tener entre 8 y 15 caracteres';
    }
    else if (this.contrasenia_formulario.get('contraseña')?.errors?.['maxlength']) {
      this.mensaje = 'La contraseña es muy larga';
    }
    return this.mensaje;
  }
  get confirmarContraseniaNoValida() {
    const pass1 = this.contrasenia_formulario.get('contraseña')?.value;
    const pass2 = this.contrasenia_formulario.get('confirmar_contraseña')?.value;

    return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
      ? false
      : true;
  }
}
