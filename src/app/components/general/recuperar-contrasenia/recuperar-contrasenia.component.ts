import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent {
  mail_formulario!: FormGroup
  destinatario: string ='';
  constructor(
    private authService : AuthService,
    private fb : FormBuilder,
    private router: Router
    ){
      this.crearFormulario();
    }

 ngOnInit(): void {
   this.enviarMail();
   this.crearFormulario();
 }
  crearFormulario(){
    this.mail_formulario=this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
    })
    }
  
   enviarMail(){
    if (!this.mail_formulario.invalid){
      this.destinatario = this.mail_formulario.value['correo']
  this.authService.enviarMail(this.destinatario)
  .subscribe({
    next: (res: boolean)=>{
      Swal.fire({
        icon:'success',
        title:'Éxito',
        text:'El correo ha sido enviado con éxito',
        confirmButtonColor:'#198754',
      })
    },
    error: (err)=>{
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'Hubo un error al enviar el correo',
        confirmButtonColor:'#198754',
      })
      console.log(`correo no enviado: ${err}`);
      
    }
  })
  }
   }

   notOnlyWhitespace(control: AbstractControl) {
    if (control.value !== null && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    }
    return null;
  }
}
