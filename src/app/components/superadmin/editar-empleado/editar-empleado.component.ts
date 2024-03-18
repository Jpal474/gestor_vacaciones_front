import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SaldoActualizado } from 'src/app/interfaces/actualizar_saldo-vacacional.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})
export class EditarEmpleadoComponent {
  fieldTextType:boolean=false;
  fieldTextType2:boolean=false;
  mensaje='';
  pass = '';
  rol = '';
  id_usuario ='';
  id_empleado = '';
  aux_fecha = '';
  empleado_formulario!: FormGroup;
  departamentos: Departamento[]= [];
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
  empleado: Empleado={
    id:'',
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
    private fb: FormBuilder,
    private superadService: SuperadService,
    private router: Router,
    private activadedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  crearFormulario(){
this.empleado_formulario= this.fb.group({
  nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
  apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
  nombre_usuario: ['', [Validators.required, this.notOnlyWhitespace]],
  correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
  genero: ['', Validators.required],
  departamento: ['', Validators.required],
  fecha_contratacion: ['', [Validators.required, this.maxDateValidator]],
  contraseña: ['', [Validators.minLength(8), Validators.maxLength(15)]],
  confirmar_contraseña: [''],
})
  }

  ngOnInit(): void {
    this.getDepartamentos();
    const params = this.activadedRoute.snapshot.params;
    if(params){
      this.superadService.getEmpleadoById(params['id'])
      .subscribe({
        next: (res: Empleado)=> {
          console.log(res);
          this.id_usuario= res.usuario.id!;
          this.id_empleado=res.id!;
          this.empleado.id=res.id;
          this.usuario.id= res.usuario.id;
          this.pass = res.usuario.contraseña!;
          this.rol = res.usuario.rol?.nombre!;
          this.aux_fecha = res.fecha_contratacion;
          let departamento
          if(res.departamento === null){
            departamento = {
              id: 9,
              nombre: 'sin departamento'
            }
          }else{
            departamento = res.departamento;
          }
          
          this.empleado_formulario.patchValue({
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

  getDepartamentos(){
    this.superadService.getAllDepartamentos()
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

  confirmarActulizacion(){
    if (!this.empleado_formulario.invalid){
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
          this.actualizarEmpleado();
        }
      })
    }
    else {
      return Object.values(this.empleado_formulario.controls).forEach(
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

  actualizarEmpleado(){    
    if (!this.empleado_formulario.invalid) {
      if(this.empleado_formulario.value['contraseña'].length > 0 && this.empleado_formulario.value['contraseña'].trim() === ''){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña no puede consistir sólo en espacios en blanco',
          confirmButtonColor:'#198754',
        })
      }
      else{
           this.empleado.nombre = this.empleado_formulario.value['nombre'];
           this.empleado.apellidos = this.empleado_formulario.value['apellidos'];
           this.empleado.genero = this.empleado_formulario.value['genero'];
           this.empleado.fecha_contratacion = this.empleado_formulario.value['fecha_contratacion'];
           this.empleado.usuario.nombre_usuario = this.empleado_formulario.value['nombre_usuario'];
           this.empleado.usuario.correo = this.empleado_formulario.value['correo'];
           this.actualizarDepartamento();
           if(this.empleado_formulario.value['contraseña'].length > 0){
            this.empleado.usuario.contraseña = this.empleado_formulario.value['contraseña']
           }

           console.log('empleado', this.empleado);
           
           
           this.superadService.updateUsuario(this.empleado.usuario, this.id_usuario!)
           .subscribe({
            next: (res:Usuario)=> {
              this.empleado.usuario = res;
              console.log(this.empleado, 'empleado antes de actualizar');
              
              if(this.rol === 'Administrador'){
               this.superadService.updateAdministrador(this.empleado, this.id_empleado!)
               .subscribe({
                next: (res: Empleado)=> {
                  if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                    this.actualizarSaldoVacacional();
                  }
                  else if (res){
                    Swal.fire({
                      icon: 'success',
                      title: 'Éxito',
                      text: 'El Administrador ha sido guardado con éxito',
                      confirmButtonColor:'#198754',
                    }),
                    setTimeout(() =>{
                      this.router.navigate([`/super/empleados`]);
                   }, 2000);
                  } 
                },
                error(err) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se ha podido actualizar al Administrador',
                    confirmButtonColor:'#198754'
                  }) 
                  
                },
               })
              }
              else{
                this.superadService.updateTrabajador(this.empleado, this.id_empleado!)
                .subscribe({
                  next: (res: Empleado)=> {
                    if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                      this.actualizarSaldoVacacional();
                    }
                    else if (res){
                      Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El Trabajador ha sido guardado con éxito',
                        confirmButtonColor:'#198754',
                      }),
                      setTimeout(() =>{
                        this.router.navigate([`/super/empleados`]);
                     }, 2000);
                    }
                    
                  },
                  error(err) {
                    console.log('error',err);
                    
                  },
                })
              }
            },
            error(err) {
              console.log('error',err);
              
            },
           })
           
      }
            
    } else {
      console.log(this.empleado_formulario);
      return Object.values(this.empleado_formulario.controls).forEach(
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

  actualizarDepartamento(){    
    let id_departamento = this.empleado_formulario.value['departamento']
    console.log('id_departamento', id_departamento);
    for (let j = 0; j < this.departamentos.length; j++){
      if(this.departamentos[j].id == parseInt(id_departamento)){        
        this.empleado.departamento = this.departamentos[j]
      }
    }
  }

async actualizarSaldoVacacional(){
  const año = new Date().getFullYear();
  const fechaFormateada = new Date().toISOString().split('T')[0];
  let fecha_c = '';
  if( this.empleado.fecha_contratacion){
    fecha_c =this.empleado.fecha_contratacion
  }
  else{
    fecha_c = this.empleado_formulario.value['fecha_contratacion']
  }
  const actual = moment(fechaFormateada, 'YYYY-MM-DD');
  const fecha_contratacion = moment(fecha_c, 'YYYY-MM-DD');
  const diferencia = actual.diff(fecha_contratacion, 'year');
  if (diferencia > 0) {
    let { value: dias_tomados } = await Swal.fire({//ingresa el nombre del departamento
      title: 'Ingrese Los Dias Vacacionales Tomados Por Su Trabajador',
      input: 'text',
      inputLabel: 'En caso de no tener, deje en blanco el espacio o escruba 0',
      inputPlaceholder: 'Días Tomados',
      confirmButtonColor: '#198754'
    });   

    if(dias_tomados && parseInt(dias_tomados)>0){
      this.saldo_vacacional.dias_tomados = parseInt(dias_tomados);    
  }else if (dias_tomados && parseInt(dias_tomados) === 0){
    this.saldo_vacacional.dias_tomados = 0;
  }
  else{
    this.saldo_vacacional.dias_tomados =0;
    dias_tomados=0;
  }
  
    
    if (diferencia === 1) { 
      this.saldo_vacacional.dias_disponibles = 12-dias_tomados;
    } else if (diferencia === 2) {
      this.saldo_vacacional.dias_disponibles = 14-dias_tomados;

    } else if (diferencia === 3) {
      this.saldo_vacacional.dias_disponibles = 16-dias_tomados;

    } else if (diferencia === 4) {
      this.saldo_vacacional.dias_disponibles = 18-dias_tomados;
    } else if (diferencia === 5) {
      this.saldo_vacacional.dias_disponibles = 20-dias_tomados;
    } else if (diferencia >= 6 || diferencia <= 10) {
      this.saldo_vacacional.dias_disponibles = 22-dias_tomados;
    } else if (diferencia >= 11 || diferencia <= 15) {
      this.saldo_vacacional.dias_disponibles = 24-dias_tomados;
    } else if (diferencia >= 16 || diferencia <= 20) {
      this.saldo_vacacional.dias_disponibles = 26-dias_tomados;
    } else if (diferencia >= 21 || diferencia <= 25) {
      this.saldo_vacacional.dias_disponibles = 28-dias_tomados;
    } else if (diferencia >= 26 || diferencia <= 30) {
      this.saldo_vacacional.dias_disponibles = 30-dias_tomados;
    } else if (diferencia >= 31 || diferencia <= 35) {
      this.saldo_vacacional.dias_disponibles = 32-dias_tomados;
    }
  }

  if(this.empleado.id){
    console.log(this.saldo_vacacional);
    
this.superadService.updateSaldoVacacional(this.empleado.id!,año, this.saldo_vacacional)
.subscribe({
  next: (res: SaldoVacacional)=> {
    if(res){
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Los Datos Han Sido Actualizados de Forma Éxitosa',
      confirmButtonColor:'#198754',
    }),
    setTimeout(() =>{
      this.router.navigate([`/admin/trabajadores`]);
   }, 2000);
  } 
  },
  error: (err)=> {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar los datos',
      confirmButtonColor:'#198754',
    }) 
    console.log(err);
    
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
      this.empleado_formulario.get('nombre')?.errors?.['required'] &&
      this.empleado_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.empleado_formulario.get('nombre')?.errors?.['pattern']) {
      console.log('nombre no valido');
      
      this.mensaje = 'El nombre no puede contener números o carácteres especiales';
    } else if (
      this.empleado_formulario.get('nombre')?.errors?.['notOnlyWhitespace'] &&
      this.empleado_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El nombre no puede consistir solo en espacios en blanco.';
    }
    else if (
      this.empleado_formulario.get('nombre')?.errors?.['minlength']
    ) {
      this.mensaje = 'El nombre debe tener al menos 3 letras';
    }
    return this.mensaje;
  }

  get apellidosNoValidos(){
    this.mensaje='';
    if( this.empleado_formulario.get('apellidos')?.errors?.['required'] && this.empleado_formulario.get('apellidos')?.touched){
      this.mensaje= "El campo no puede estar vacío";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['pattern']){
      this.mensaje= "El/Los apellidos no pueden contener números o carácteres especiales";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['notOnlyWhitespace'] && this.empleado_formulario.get('apellidos')?.touched) {
      this.mensaje= "El campo no puede consistir sólo en espacios en blanco.";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['minlength']) {
      this.mensaje= "Los apellidos debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get nombreUsuarioNoValido(){
    this.mensaje='';
    if( this.empleado_formulario.get('nombre_usuario')?.errors?.['required'] && this.empleado_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    } 
    else if( this.empleado_formulario.get('nombre_usuario')?.errors?.['notOnlyWhitespace'] && this.empleado_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede consistir sólo en espacios en blanco"
    }
    else if(this.empleado_formulario.get('nombre_usuario')?.errors?.['minlength']) {
      this.mensaje= "El nombre de usuario debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get correoNoValido() {
    this.mensaje='';
    if (
      this.empleado_formulario.get('correo')?.errors?.['required'] &&
      this.empleado_formulario.get('correo')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.empleado_formulario.get('correo')?.errors?.['pattern']) {
      this.mensaje = 'Ingrese un formato de correo válido';
    }
    return this.mensaje;
  }

  get departamentoNoValido(){
    if(this.empleado_formulario.get('departamento')?.invalid && this.empleado_formulario.get('departamento')?.touched){
     this.mensaje = 'El campo no puede estar vacío';
    }
    return this.mensaje;
  }

  get generoNoValido(){
    this.mensaje='';
    if(this.empleado_formulario.get('genero')?.invalid && this.empleado_formulario.get('genero')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    }
    return this.mensaje;
  }

  get fechaNoValida(){
    this.mensaje;
    if (this.empleado_formulario.get('fecha_contratacion')?.invalid && this.empleado_formulario.get('fecha_contratacion')?.touched){
      this.mensaje = "El campo no puede estar vacío"
    }
    return this.mensaje;
  }

  get contraseniaNoValido() {
    this.mensaje = '';
     if (
      this.empleado_formulario.get('contraseña')?.errors?.['minlength']
    ) {
      this.mensaje = 'La contraseña debe tener entre 8 y 15 caracteres';
    }
    else if (this.empleado_formulario.get('contraseña')?.errors?.['maxlength']) {
      this.mensaje = 'La contraseña es muy larga';
    }
    return this.mensaje;
  } 

  get confirmarContraseniaNoValida() {
    const pass1 = this.empleado_formulario.get('contraseña')?.value;
    const pass2 = this.empleado_formulario.get('confirmar_contraseña')?.value;

    return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
      ? false
      : true;
  }

}
