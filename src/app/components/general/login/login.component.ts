import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Login } from 'src/app/interfaces/login.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private SECRETKEY = 'LMkjo~Xw]FEn9]BIvls05A4nlV%mUzV{Q6s35RTd~h3(m-6'
  login_formulario!: FormGroup;
  usuarioNotFound!:string
  passwordInvalid!:string
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router:Router, 
    private adminService:AdminService,
    private storageService: StorageService,
    ) {
  }

  ngOnInit(): void {
    this.crearFormulario();
  }
  crearFormulario() {
    this.login_formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
      contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
    });
  }

  login(){
    console.log('entra',this.login_formulario.value.correo, this.login_formulario.value.contraseña);
    
    this.authService.getAuth(this.login_formulario.value.correo, this.login_formulario.value.contraseña)
    .subscribe({
      next: (login: Login) => {
        console.log(login);
        
        this.usuarioNotFound = '';
        this.passwordInvalid = '';
        this.storageService.setLocalStorageItem('token', login.accessToken)
        const empleado = this.authService.decodeUserFromToken(login.accessToken);
        this.storageService.setLocalStorageItem('usuario', empleado.nombre)
        this.storageService.setLocalStorageItem('id', empleado.id)
        this.storageService.setLocalStorageItem('tipo', empleado.rol)
        this.storageService.setLocalStorageItem('correo', empleado.correo)
        if(empleado.rol === 'SuperAdministrador'){
          this.router.navigate(['/super/inicio']);
        }
        else if(empleado.rol === 'Administrador'){
          this.router.navigate(['/admin/inicio']);
        }
        else if(empleado.rol === 'Trabajador'){
          this.router.navigate(['/trabajador/inicio'])
        }
        console.log('bienvenido', empleado.nombre);
        
        Swal.fire({
          title: `Bienvenido(a) ${empleado.nombre}`,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          confirmButtonColor:'#198754'
          
        })
        
      },
      error: (e)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al iniciar sesión, revise sus credenciales y si el error persiste, contacte al sopote de la página',
          confirmButtonColor: '#198754'
        })
      }
    })
  }

  notOnlyWhitespace(control: AbstractControl) {
    if (control.value !== null && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    }
    return null;
  }

  get correoNoValido():string{
    let mensaje="";
    if(this.login_formulario.get('correo')?.errors?.['required'] && this.login_formulario.get('correo')?.touched){
        mensaje="El campo no puede estar vacío"
    }
    else if(this.login_formulario.get('correo')?.errors?.['pattern']){
      mensaje="Ingrese un formato de correo válido"
    }
    else if (
      this.login_formulario.get('correo')?.errors?.['notOnlyWhitespace'] &&
      this.login_formulario.get('correo')?.touched
    ) {
      mensaje = 'El campo no puede consistir solo en espacios en blanco.';
    }
    return mensaje;
          }

  get contraseniaNoValida():string {
    let mensaje="";
    if(this.login_formulario.get('contraseña')?.errors?.['required'] && this.login_formulario.get('contraseña')?.touched){
      mensaje = "El campo no puede estar vacío";
    }
    else if(this.login_formulario.get('contraseña')?.errors?.['notOnlyWhitespace'] &&
    this.login_formulario.get('contraseña')?.touched){
      mensaje = "El campo no puede consistir sólo en espacios en blanco.";
    }
    return mensaje;
  }

}
