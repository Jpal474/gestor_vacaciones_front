import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ceo } from 'src/app/interfaces/ceo.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent {
  fieldTextType:boolean=false;
  fieldTextType2:boolean=false;
  ceo_formulario!: FormGroup;
  mensaje='';
  pass = '';
  rol = '';
  id_usuario ='';
  id_ceo = '';
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
  ceo = {} as Ceo
  

  constructor(
    private superadService: SuperadService,
    private fb: FormBuilder,
    private router: Router,
    private activadedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

 ngOnInit(): void {
    const params = this.activadedRoute.snapshot.params;
    if(params){
      this.id_ceo = params['id'];
      console.log('id_ceo', this.id_ceo);
      
      this.superadService.getCeoById(params['id'])
      .subscribe({
        next: (res: Ceo)=> {
          console.log(res);
          this.id_usuario = res.usuario.id!;
          console.log('-----', this.id_usuario);
          
          this.pass = res.usuario.contraseña!;
          this.ceo_formulario.patchValue({
            nombre: res.nombre,
            apellidos: res.apellidos,
            nombre_usuario: res.usuario.nombre_usuario,
            correo: res.usuario.correo,
            genero: res.genero,
            
          })
        },
      })
    }
    
  }

  crearFormulario(){
    this.ceo_formulario= this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      nombre_usuario: ['', [Validators.required, this.notOnlyWhitespace]],
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
      genero: ['', Validators.required],
      contraseña: ['', [Validators.minLength(8), Validators.maxLength(20)]],
      confirmar_contraseña: [''],
    })
      }

      toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
      }
      toggleFieldTextType2() {
        this.fieldTextType2 = !this.fieldTextType2;
      }
  
      confirmarActualizacion(){
        if (!this.ceo_formulario.invalid){
          Swal.fire({
            title: '¿Estás Seguro?',
            text: "Los cambios no son reversibles",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.editarUsuario();
            }
          })
        }
        else {
          return Object.values(this.ceo_formulario.controls).forEach(
            (control) => {
              if (control instanceof FormGroup) {
                Object.values(control.controls).forEach((control) =>
                  control.markAsTouched()
                );
              } else {
                control.markAsTouched();
              }
            }
          );
        }
      }

      editarUsuario(){
        if(!this.ceo_formulario.invalid){
          this.usuario.correo = this.ceo_formulario.value['correo'];
          this.usuario.nombre_usuario = this.ceo_formulario.value['nombre_usuario'];
          if(this.ceo_formulario.value['contraseña'].length > 0 && this.ceo_formulario.value['contraseña'].trim() === ''){
            this.usuario.contraseña = this.ceo_formulario.value['contraseña'];
            console.log('*******', this.id_usuario);
            console.log('antes de editar usuario');
            
            this.superadService.updateUsuario(this.usuario, this.id_usuario)
            .subscribe({
              next: (res: Usuario)=> {
                if(res){
                  this.ceo.usuario = res;
                  this.editarCeo();
                }
              },
              error: (err)=>{
                console.log('***error***', err);
                
              }

            })
          }
          else if(this.ceo_formulario.value['contraseña'].length === 0){
            this.usuario.contraseña = this.pass;
            this.superadService.updateUsuario(this.usuario, this.id_usuario)
            .subscribe({
              next: (res: Usuario)=> {
                if(res){
                  this.ceo.usuario = res;
                  this.editarCeo();
                }
              },
              error: (err)=>{
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Hubo un error al actualizar sus datos',
                  confirmButtonColor:'#198754',
                })
                console.log(err);
                
              }
            })
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'La contraseña no puede consistir sólo de espacios en blanco',
              confirmButtonColor:'#198754',
            }) 
          }
        }
        else{
          return Object.values( this.ceo_formulario.controls ).forEach( control => {
            if ( control instanceof FormGroup ) {
              Object.values( control.controls ).forEach( control => control.markAsTouched() );
            } else {
              control.markAsTouched();
            }
          });
        }
      }


      editarCeo(){
        if(!this.ceo_formulario.invalid){
          this.ceo.nombre = this.ceo_formulario.value['nombre']
          this.ceo.apellidos = this.ceo_formulario.value['apellidos']
          this.ceo.genero = this.ceo_formulario.value['genero']
          console.log('id_Ceo2', this.id_ceo);
          
          this.superadService.updateCeo(this.ceo, this.id_ceo)
          .subscribe({
            next: (res: Ceo)=>{
              if(res){
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Edición Completada, sus datos han sido actualizados',
                  confirmButtonColor:'#198754',
                }),
                setTimeout(() =>{
                  this.router.navigate([`/super/cuenta`]);
               }, 2000);
              }
            },
            error: (err)=>{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar sus datos',
                confirmButtonColor:'#198754',
              })
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

      get nombreNoValido(){
        this.mensaje='';
        if (
          this.ceo_formulario.get('nombre')?.errors?.['required'] &&
          this.ceo_formulario.get('nombre')?.touched
        ) {
          this.mensaje = 'El campo no puede estar vacío';
        } else if (this.ceo_formulario.get('nombre')?.errors?.['pattern']) {
          console.log('nombre no valido');
          
          this.mensaje = 'El nombre no puede contener números o carácteres especiales';
        } else if (
          this.ceo_formulario.get('nombre')?.errors?.['notOnlyWhitespace'] &&
          this.ceo_formulario.get('nombre')?.touched
        ) {
          this.mensaje = 'El nombre no puede consistir solo en espacios en blanco.';
        }
        else if (
          this.ceo_formulario.get('nombre')?.errors?.['minlength']
        ) {
          this.mensaje = 'El nombre debe tener al menos 3 letras';
        }
        return this.mensaje;
      }
    
      get apellidosNoValidos(){
        this.mensaje='';
        if( this.ceo_formulario.get('apellidos')?.errors?.['required'] && this.ceo_formulario.get('apellidos')?.touched){
          this.mensaje= "El campo no puede estar vacío";
        }
        else if(this.ceo_formulario.get('apellidos')?.errors?.['pattern']){
          this.mensaje= "El/Los apellidos no pueden contener números o carácteres especiales";
        }
        else if(this.ceo_formulario.get('apellidos')?.errors?.['notOnlyWhitespace'] && this.ceo_formulario.get('apellidos')?.touched) {
          this.mensaje= "El campo no puede consistir sólo en espacios en blanco.";
        }
        else if(this.ceo_formulario.get('apellidos')?.errors?.['minlength']) {
          this.mensaje= "Los apellidos debe contener al menos 3 letras";
        }
        return this.mensaje
      }
    
      get nombreUsuarioNoValido(){
        this.mensaje='';
        if( this.ceo_formulario.get('nombre_usuario')?.errors?.['required'] && this.ceo_formulario.get('nombre_usuario')?.touched){
          this.mensaje = "El campo no puede estar vacío";
        } 
        else if( this.ceo_formulario.get('nombre_usuario')?.errors?.['notOnlyWhitespace'] && this.ceo_formulario.get('nombre_usuario')?.touched){
          this.mensaje = "El campo no puede consistir sólo en espacios en blanco"
        }
        else if(this.ceo_formulario.get('nombre_usuario')?.errors?.['minlength']) {
          this.mensaje= "El nombre de usuario debe contener al menos 3 letras";
        }
        return this.mensaje
      }
    
      get correoNoValido() {
        this.mensaje='';
        if (
          this.ceo_formulario.get('correo')?.errors?.['required'] &&
          this.ceo_formulario.get('correo')?.touched
        ) {
          this.mensaje = 'El campo no puede estar vacío';
        } else if (this.ceo_formulario.get('correo')?.errors?.['pattern']) {
          this.mensaje = 'Ingrese un formato de correo válido';
        }
        return this.mensaje;
      }

      get generoNoValido(){
        this.mensaje='';
        if(this.ceo_formulario.get('genero')?.invalid && this.ceo_formulario.get('genero')?.touched){
          this.mensaje = "El campo no puede estar vacío";
        }
        return this.mensaje;
      }

      get contraseniaNoValido() {
        this.mensaje = '';
        if (
         this.ceo_formulario.get('contraseña')?.errors?.['minlength']
       ) {
         this.mensaje = 'La contraseña debe tener entre 8 y 15 caracteres';
       }
       else if (this.ceo_formulario.get('contraseña')?.errors?.['maxlength']) {
         this.mensaje = 'La contraseña es muy larga';
       }

      
       return this.mensaje;
      }
      get confirmarContraseniaNoValida() {
        const pass1 = this.ceo_formulario.get('contraseña')?.value;
        const pass2 = this.ceo_formulario.get('confirmar_contraseña')?.value;
    
        return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
          ? false
          : true;
      }
}
