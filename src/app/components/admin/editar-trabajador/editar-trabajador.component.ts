import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaldoActualizado } from 'src/app/interfaces/actualizar_saldo-vacacional.interface';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-editar-trabajador',
  templateUrl: './editar-trabajador.component.html',
  styleUrls: ['./editar-trabajador.component.css']
})
export class EditarTrabajadorComponent {
  fieldTextType:boolean=false;
  fieldTextType2:boolean=false;
  trabajador_formulario!: FormGroup;
  mensaje='';
  pass = '';
  rol = '';
  id_usuario ='';
  id_empleado = '';
  aux_fecha = '';
  departamentos: Departamento[]= [];
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
  trabajador: Empleado={
    nombre: '',
    apellidos: '',
    genero: EmpleadoGenero.OTRO,
    fecha_contratacion: '',
    usuario: {
      id:'',
      nombre_usuario: '',
      correo: '',
      contraseña: '',
    },
    departamento: {
      id: 0,
      nombre: ''
    }
  }
  saldo_vacacional: SaldoActualizado={
    dias_disponibles: 0,
    dias_tomados: 0,
  }

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    private activadedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

 ngOnInit(): void {
    this.getDepartamentos();
    const params = this.activadedRoute.snapshot.params;
    if(params){
      this.adminService.getEmpleadoById(params['id'])
      .subscribe({
        next: (res: Empleado)=> {
          console.log(res, 'departamentos');
          this.id_usuario= res.usuario.id!;
          this.id_empleado=res.id!;
          this.trabajador.id=res.id;
          this.usuario.id= res.usuario.id;
          this.pass = res.usuario.contraseña!;
          this.rol = res.usuario.rol?.nombre!;
          this.aux_fecha = res.fecha_contratacion;
          console.log(this.usuario.contraseña);
          let departamento
          if(res.departamento === null){
            departamento = {
              id: 9,
              nombre: 'sin departamento'
            }
          }else{
            departamento = res.departamento;
          }
          
          this.trabajador_formulario.patchValue({
            nombre: res.nombre,
            apellidos: res.apellidos,
            nombre_usuario: res.usuario.nombre_usuario,
            correo: res.usuario.correo,
            genero: res.genero,
            departamento: departamento.id,
            fecha_contratacion: res.fecha_contratacion,
            
          })
        }
      })
    }
    
  }

  crearFormulario(){
    this.trabajador_formulario= this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      nombre_usuario: ['', [Validators.required, this.notOnlyWhitespace]],
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
      genero: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha_contratacion: ['', [Validators.required, this.maxDateValidator]],
      contraseña: [''],
      confirmar_contraseña: [''],
    })
      }

getDepartamentos(){
  this.adminService.getAllDepartamentos()
  .subscribe({
      next: (res: Departamento[]) => {
          console.log(res);
          this.departamentos = res;
          }
        })
      }

      toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
      }
      toggleFieldTextType2() {
        this.fieldTextType2 = !this.fieldTextType2;
      }

confirmarActualizacion(){
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Los cambios no son reversibles",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#d33',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Guardar'
  }).then((result) => {
    if (result.isConfirmed) {
     this.actualizarTrabajador();
    }
  })
}

actualizarTrabajador(){
  if(!this.trabajador_formulario.invalid){
    if(this.trabajador_formulario.value['contraseña'].length > 0 && this.trabajador_formulario.value['contraseña'].trim() === ''){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña no puede consistir sólo en espacios en blanco',
        confirmButtonColor:'#198754',
      })
    }
    else{
      this.trabajador.nombre = this.trabajador_formulario.value['nombre'];
      this.trabajador.apellidos = this.trabajador_formulario.value['apellidos'];
      this.trabajador.genero = this.trabajador_formulario.value['genero'];
      this.trabajador.fecha_contratacion = this.trabajador_formulario.value['fecha_contratacion'];
      this.trabajador.usuario.nombre_usuario = this.trabajador_formulario.value['nombre_usuario'];
      this.trabajador.usuario.correo = this.trabajador_formulario.value['correo'];
      this.actualizarDepartamento();
      if (this.trabajador_formulario.value['contraseña'].length > 0){
        this.trabajador.usuario.contraseña = this.trabajador_formulario.value['contraseña']
      }

      this.adminService.updateUsuario(this.trabajador.usuario, this.id_usuario!)
      .subscribe({
        next: (res: Usuario)=> {
           this.adminService.updateTrabajador(this.trabajador, this.id_empleado!)
           .subscribe({
            next: (res: Empleado)=> {
              if(res && this.aux_fecha !== this.trabajador_formulario.value['fecha_contratacion'] ){
                this.actualizarSaldoVacacional();
              }else if(res){
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'El Trabajador ha sido guardado con éxito',
                confirmButtonColor:'#198754'
              }),
              setTimeout(() =>{
                this.router.navigate([`/admin/trabajadores`]);
             }, 2000);
            }
            }
           })
        },
        error: (err)=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar el trabajador',
            confirmButtonColor:'#198754',
          }),
          console.log(err);
          
          setTimeout(function(){
            window.location.reload();
         }, 2000);

        }
      })

    }
    
  }
  else{
    return Object.values( this.trabajador_formulario.controls ).forEach( control => {
      if ( control instanceof FormGroup ) {
        Object.values( control.controls ).forEach( control => control.markAsTouched() );
      } else {
        control.markAsTouched();
      }
    });
  }
}

actualizarDepartamento(){
  let id_departamento = this.trabajador_formulario.value['departamento']
  for (let j = 0; j < this.departamentos.length; j++){
    if(this.departamentos[j].id === id_departamento){
      this.trabajador.departamento = this.departamentos[j]
    }
  }
}


async actualizarSaldoVacacional(){
  const año = new Date().getFullYear();
  const fechaFormateada = new Date().toISOString().split('T')[0];
  console.log(fechaFormateada, 'formateada');
  const actual = moment(fechaFormateada, 'YYYY/MM/DD');
  console.log('fecha_c', this.trabajador.fecha_contratacion);
  const fecha_contratacion = moment(this.trabajador.fecha_contratacion, 'YYYY/MM/DD');
  const diferencia = actual.diff(fecha_contratacion, 'years');
  console.log('actual', actual);
  console.log('fecha_contratacion', fecha_contratacion);
  console.log('diferencia', diferencia);
  if (diferencia > 0) {
    const { value: dias_tomados } = await Swal.fire({//ingresa el nombre del departamento
      title: 'Ingrese Los Dias Vacacionales Tomados Por Su Trabajador',
      input: 'text',
      inputLabel: 'En caso de no tener, deje en blanco el espacio',
      inputPlaceholder: 'Ingrese Nombre del Departamento',
      confirmButtonColor: '#198754'
    });   

    if(dias_tomados && parseInt(dias_tomados)>0){
      this.saldo_vacacional.dias_tomados = parseInt(dias_tomados);    
  }else if (!(dias_tomados) || parseInt(dias_tomados) === 0){
    this.saldo_vacacional.dias_tomados = 0;
  }
    
    if (diferencia === 1) { 
      this.saldo_vacacional.dias_disponibles = 12-this.saldo_vacacional.dias_tomados;
    } else if (diferencia === 2) {
      this.saldo_vacacional.dias_disponibles = 14-this.saldo_vacacional.dias_tomados;

    } else if (diferencia === 3) {
      this.saldo_vacacional.dias_disponibles = 16-this.saldo_vacacional.dias_tomados;

    } else if (diferencia === 4) {
      this.saldo_vacacional.dias_disponibles = 18-this.saldo_vacacional.dias_tomados;
    } else if (diferencia === 5) {
      this.saldo_vacacional.dias_disponibles = 20-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 6 || diferencia <= 10) {
      this.saldo_vacacional.dias_disponibles = 22-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 11 || diferencia <= 15) {
      this.saldo_vacacional.dias_disponibles = 24-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 16 || diferencia <= 20) {
      this.saldo_vacacional.dias_disponibles = 26-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 21 || diferencia <= 25) {
      this.saldo_vacacional.dias_disponibles = 28-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 26 || diferencia <= 30) {
      this.saldo_vacacional.dias_disponibles = 30-this.saldo_vacacional.dias_tomados;
    } else if (diferencia >= 31 || diferencia <= 35) {
      this.saldo_vacacional.dias_disponibles = 32-this.saldo_vacacional.dias_tomados;
    }

  console.log('saldo vacacional',this.saldo_vacacional);
  }

  if(this.trabajador.id){
this.adminService.updateSaldoVacacional(this.trabajador.id!,año, this.saldo_vacacional)
.subscribe({
  next: (res: SaldoVacacional)=> {
    if(res){
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Los Datos Han Sido Actualizados Éxitosamente',
      }),
      setTimeout(() =>{
        this.router.navigate([`/admin/trabajadores`]);
     }, 2000);
  } 
  },
  error: (err)=> {
    const cadena:string = 'Unknown Error'
    if(cadena.includes(err)){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha habido un error al completar la solicitud',
      })
    }
    else if('unauthorized'.includes(err)){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe iniciar sesión para completar la acción',
      })
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err,
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
    
      maxDateValidator(control: AbstractControl) {
        const fechaContratacion = new Date(control.value);
        const hoy = new Date();
    
        let edad = hoy.getFullYear() - fechaContratacion.getFullYear();
        const mesActual = hoy.getMonth();
        const mesContratacion = fechaContratacion.getMonth();
    
        if (
          mesActual < mesContratacion ||
          (mesActual === mesContratacion && hoy.getDate() < fechaContratacion.getDate())
        ) {
          // Si no ha cumplido años todavía
          edad--;
        }
    
        if (edad > 50) {
          return { maxAge: true };
        }
    
        return null;
      }
      get nombreNoValido(){
        this.mensaje='';
        if (
          this.trabajador_formulario.get('nombre')?.errors?.['required'] &&
          this.trabajador_formulario.get('nombre')?.touched
        ) {
          this.mensaje = 'El campo no puede estar vacío';
        } else if (this.trabajador_formulario.get('nombre')?.errors?.['pattern']) {
          console.log('nombre no valido');
          
          this.mensaje = 'El nombre no puede contener números o carácteres especiales';
        } else if (
          this.trabajador_formulario.get('nombre')?.errors?.['notOnlyWhitespace'] &&
          this.trabajador_formulario.get('nombre')?.touched
        ) {
          this.mensaje = 'El nombre no puede consistir solo en espacios en blanco.';
        }
        else if (
          this.trabajador_formulario.get('nombre')?.errors?.['minlength']
        ) {
          this.mensaje = 'El nombre debe tener al menos 3 letras';
        }
        return this.mensaje;
      }
    
      get apellidosNoValidos(){
        this.mensaje='';
        if( this.trabajador_formulario.get('apellidos')?.errors?.['required'] && this.trabajador_formulario.get('apellidos')?.touched){
          this.mensaje= "El campo no puede estar vacío";
        }
        else if(this.trabajador_formulario.get('apellidos')?.errors?.['pattern']){
          this.mensaje= "El/Los apellidos no pueden contener números o carácteres especiales";
        }
        else if(this.trabajador_formulario.get('apellidos')?.errors?.['notOnlyWhitespace'] && this.trabajador_formulario.get('apellidos')?.touched) {
          this.mensaje= "El campo no puede consistir sólo en espacios en blanco.";
        }
        else if(this.trabajador_formulario.get('apellidos')?.errors?.['minlength']) {
          this.mensaje= "Los apellidos debe contener al menos 3 letras";
        }
        return this.mensaje
      }
    
      get nombreUsuarioNoValido(){
        this.mensaje='';
        if( this.trabajador_formulario.get('nombre_usuario')?.errors?.['required'] && this.trabajador_formulario.get('nombre_usuario')?.touched){
          this.mensaje = "El campo no puede estar vacío";
        } 
        else if( this.trabajador_formulario.get('nombre_usuario')?.errors?.['notOnlyWhitespace'] && this.trabajador_formulario.get('nombre_usuario')?.touched){
          this.mensaje = "El campo no puede consistir sólo en espacios en blanco"
        }
        else if(this.trabajador_formulario.get('nombre_usuario')?.errors?.['minlength']) {
          this.mensaje= "El nombre de usuario debe contener al menos 3 letras";
        }
        return this.mensaje
      }
    
      get correoNoValido() {
        this.mensaje='';
        if (
          this.trabajador_formulario.get('correo')?.errors?.['required'] &&
          this.trabajador_formulario.get('correo')?.touched
        ) {
          this.mensaje = 'El campo no puede estar vacío';
        } else if (this.trabajador_formulario.get('correo')?.errors?.['pattern']) {
          this.mensaje = 'Ingrese un formato de correo válido';
        }
        return this.mensaje;
      }
    
      get departamentoNoValido(){
        if(this.trabajador_formulario.get('departamento')?.invalid && this.trabajador_formulario.get('departamento')?.touched){
         this.mensaje = 'El campo no puede estar vacío';
        }
        return this.mensaje;
      }
    
      get generoNoValido(){
        this.mensaje='';
        if(this.trabajador_formulario.get('genero')?.invalid && this.trabajador_formulario.get('genero')?.touched){
          this.mensaje = "El campo no puede estar vacío";
        }
        return this.mensaje;
      }

      get fechaNoValida(){
        this.mensaje;
        if (this.trabajador_formulario.get('fecha_contratacion')?.invalid && this.trabajador_formulario.get('fecha_contratacion')?.touched){
          this.mensaje = "El campo no puede estar vacío"
        }
        return this.mensaje;
      }
    
      get contraseniaNoValido() {
        return (
          this.trabajador_formulario.get('contraseña')?.invalid &&
          this.trabajador_formulario.get('contraseña')?.touched
        );
      }
      get confirmarContraseniaNoValida() {
        const pass1 = this.trabajador_formulario.get('contraseña')?.value;
        const pass2 = this.trabajador_formulario.get('confirmar_contraseña')?.value;
    
        return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
          ? false
          : true;
      }
    
        


}
