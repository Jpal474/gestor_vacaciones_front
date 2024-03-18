import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudCrear } from 'src/app/interfaces/crear_solicitud.interface';
import {
  Empleado,
  EmpleadoGenero,
} from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import {
  Solicitud,
  SolicitudEstado,
} from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { EmailTrabajadores } from 'src/app/interfaces/email_trabajadores.interface';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { FestivosService } from 'src/app/services/festivos.service';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css'],
})
export class CrearSolicitudComponent implements OnInit {
  mensaje = '';
  max_date = moment(new Date().getFullYear().toString() + '-12-31').format('YYYY-MM-DD');
  min_date = moment(new Date()).add(14, 'days').format(
    'YYYY-MM-DD'
  );
  dias_festivos: string[] = [];
  reglas: string[] = [
    '01-01',
    '1st monday in Frebruary',
    '3rd monday in March',
    '05-01',
    '09-16',
    '3rd monday in November',
    '12-01 every 6 years since 1934',
    '12-25',
  ];
  solicitud_formulario!: FormGroup;
  empleado: Empleado = {
    nombre: '',
    apellidos: '',
    genero: EmpleadoGenero.OTRO,
    fecha_contratacion: '',
    usuario: {
      id: '',
      nombre_usuario: '',
      correo: '',
      contraseña: '',
    },
    departamento: {
      id: 0,
      nombre: '',
    },
  };
  saldo_vacacional: SaldoVacacional = {
    año: 0,
    dias_disponibles: 0,
    dias_tomados: 0,
    empleado: {
      id: '',
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
    },
  };
  solicitud: SolicitudCrear = {
    fecha_inicio: '',
    fecha_fin: '',
    estado: SolicitudEstado.PENDIENTE,
    justificacion: '',
    empleado: {
      id: '',
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
    },
  };
  mail: EmailTrabajadores = {
    nombre: '',
    destinatarios: [],
  };

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadoresService,
    private festivosService: FestivosService,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    const fecha_actual = moment(new Date(), 'YYYY-MM-DD')
    if(fecha_actual.month() === 12 && fecha_actual.date() >= 16){
      const nuevo_año = new Date().getFullYear()+1;
      this.max_date=moment(nuevo_año.toString() + '-12-31').format('YYYY-MM-DD');
    }

    console.log(this.max_date, 'fecha máxima');
    
    const id_usuario = this.storageService.getLocalStorageItem('id') + '';
    if (id_usuario) {
      console.log(id_usuario);

      this.trabajadorService.getEmpleadoByUserId(id_usuario).subscribe({
        next: (res: Empleado) => {
          if (res) {
            this.empleado = res;
            console.log(this.empleado);
            console.log('----');
            
            this.getSaldoVacacional();
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al obtener sus datos',
          });
          console.log(err);
          
        },
        complete: () => {
          this.festivosService.getDiasFeriados().subscribe({
            next: (res: DiasFeriados[]) => {
              let i = 0;
              res.map((event) => {
                if (
                  event.type === 'public' &&
                  this.reglas.includes(event.rule)
                ) {
                  this.dias_festivos[i] = moment(event.date).format(
                    'YYYY-MM-DD'
                  );
                  i++;
                }
              });
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
      });
    }
  }

  crearFormulario() {
    this.solicitud_formulario = this.fb.group(
      {
        fecha_inicio: [
          '',
          [
            Validators.required,
            this.minDateValidator,
            this.allowedDateValidator,
          ],
        ],
        fecha_fin: ['', Validators.required],
        justificacion: ['', Validators.maxLength(350)],
      },
      {
        validators: [this.maxDateValidator('fecha_inicio', 'fecha_fin'), this.rangeDateValidator('fecha_inicio', 'fecha_fin')],
      }
    );
  }

  crearSolicitud() {
    if (!this.solicitud_formulario.invalid) {
      this.solicitud.fecha_inicio =
        this.solicitud_formulario.value['fecha_inicio'];
      this.solicitud.fecha_fin = this.solicitud_formulario.value['fecha_fin'];
      this.solicitud.justificacion =
        this.solicitud_formulario.value['justificacion'];
      this.solicitud.empleado.id = this.empleado.id!;
      this.solicitud.empleado.nombre = this.empleado.nombre;
      this.solicitud.empleado.apellidos = this.empleado.apellidos;
      this.solicitud.empleado.genero = this.empleado.genero;
      this.solicitud.empleado.fecha_contratacion;
      this.trabajadorService.createSolicitud(this.solicitud).subscribe({
        next: (res: Solicitud) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La Solicitud Ha Sido Creada con Éxito',
              confirmButtonColor:'#198754',
            }),
              this.enviarMail();
            setTimeout(() => {
              this.router.navigate(['/trabajador/solicitud', res.id]);
            }, 3000);
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la solicitud',
            confirmButtonColor:'#198754',
          });
        },
      });
    }
    else{
      return Object.values( this.solicitud_formulario.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  async crearSolicitudPorDias() {
    let justificacion = '';
    const a = 5;
    const { value: formValues } = await Swal.fire({
      title: 'Datos de la Solicitud',
      html:
        '<label >Fecha de Inicio</label>' +
        '<br>' + //creamos un label para la fecha inicial
        `<input id="swal-input1" class="swal2-input" type="date" max="${this.max_date}" min="${this.min_date}" required>` +
        '<br>' + //creamos un input para la fecha de inicio
        '<label for="swal-input2">Cantidad de Días</label>' + //label para cantidad de dias
        '<input id="swal-input2" pattern="[0-9]{2}" title="Ingrese un número menor o igual a 2 digitos" class="swal2-input"> <br>'+
        'ó <br> <input type="radio" id="todos_dias"> Seleccionar Todos',
          //en el input de arriba se valida que se ingrese un numero de 2 digitos o menos
        focusConfirm: false,
      preConfirm: () => {
        const input1 = document.getElementById(
          'swal-input1'
        ) as HTMLInputElement;
        const input2 = document.getElementById(
          'swal-input2'
        ) as HTMLInputElement;
        const miCheckbox = document.getElementById('todos_dias') as HTMLInputElement;
 
        console.log(miCheckbox.checked)
        console.log(input1.value);
        

        if (input1.value && input2.value) {
          return [input1.value, input2.value];
        }
        else if (input1.value && miCheckbox.checked){
          console.log('entra el if i 1 y cb');
          
          input2.value = this.saldo_vacacional.dias_disponibles.toString();
          return [input1.value, input2.value];
        }
        else {
          // Handle the case where one or both elements are not found in the DOM
          // Return an array with default or error values
          return []; //retornamos un array vacío en caso de que no se agreguen valores
        }

      },
    });

    console.log(JSON.stringify(formValues));
    
    
    if (formValues && (parseInt(formValues[1]) <= this.saldo_vacacional.dias_disponibles)) {
      console.log('entra al if');
      
      //validamos en el if que formValues tenga valores y que la posición 1 que corresponde a los días solicitados sea menor o igual a sus días disponibles
      Swal.fire({
        title: '¿Desea añadir Justificación?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Sí',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Justificacion',
            inputPlaceholder:
              'Digite su mensaje menor o igual a 300 caracteres aquí',
            inputAttributes: {
              'aria-label': 'Type your message here',
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
          });
          if (text && text.length <= 300) {
            justificacion = text;
            this.guardarSolicitudPorDias(formValues, justificacion);
          } else if (text.length > 300) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Su justificación debe ser menor o igual a 300 carácteres',
              confirmButtonColor:'#198754',
            });
          }
        }else{

          this.guardarSolicitudPorDias(formValues, justificacion);
        }
      });
      
    }
  }

  guardarSolicitudPorDias(formValues: string[], justificacion: string) {
    const fecha_inicio = moment(formValues[0], 'YYYY/MM/DD')
    let fecha_actual = fecha_inicio;
    let i = 0;    
    while(i < parseInt(formValues[1])){
     if(fecha_actual.day() !== 6 && fecha_actual.day() !== 0){
      if(! this.dias_festivos.includes(fecha_actual.format('YYYY/MM/DD'))){
        i++
      }
     }
     fecha_actual.add(1, 'days');
    }
    this.solicitud.fecha_inicio = moment(formValues[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.solicitud.fecha_fin = fecha_actual.format('YYYY-MM-DD');
    this.solicitud.justificacion = justificacion;
    this.solicitud.empleado.id = this.empleado.id!;
    this.solicitud.empleado.nombre = this.empleado.nombre;
    this.solicitud.empleado.apellidos = this.empleado.apellidos;
    this.solicitud.empleado.genero = this.empleado.genero;
    this.solicitud.empleado.fecha_contratacion;
    console.log(this.solicitud);
    
    this.trabajadorService.createSolicitud(this.solicitud).subscribe({
      next: (res: Solicitud) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La Solicitud Ha Sido Creada con Éxito',
            confirmButtonColor:'#198754',
          }),
            this.enviarMail();

          setTimeout(() => {
            this.router.navigate(['/trabajador/inicio']);
          }, 3000);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear la solicitud',
          confirmButtonColor:'#198754',
        });
      },
    });    
  }

  getSaldoVacacional() {
    const dia = new Date().getDate();
      const mes = new Date().getMonth();
      let año = 0;
      if(dia >= 18 && mes === 12){
        año = new Date().getFullYear() + 1;
      }else{
        año = new Date().getFullYear()
      }
    
    this.trabajadorService
      .getSaldoByEmpleadoId(this.empleado.id!, año)
      .subscribe({
        next: (res: SaldoVacacional) => {
          console.log(res);
          
          if (res) {
            this.saldo_vacacional = res;
            console.log(this.saldo_vacacional, 'saldo');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  enviarMail() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: 'Enviando Notificación de Solicitud',
    });
    this.mail.nombre = this.empleado.nombre + this.empleado.apellidos;
    this.trabajadorService.getMails().subscribe({
      next: (res: string[]) => {
        if (res) {
          this.mail.destinatarios = res
          this.trabajadorService.enviarMail(this.mail).subscribe({
            next: (res: boolean) => {
              if (res) {
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Notificación Enviada',
                  confirmButtonColor:'#198754',
                });
              }
            },
          });
        }
      },
    });
  }

  minDateValidator(control: AbstractControl) {
    const fechaInicio = moment(new Date(control.value), 'YYYY/MM/DD');
    const hoy = moment(new Date().toISOString().split('T')[0], 'YYYY/MM/DD');
    const diferencia = fechaInicio.diff(hoy, 'days');
    if (diferencia <= 14) {
      console.log('poca anticipacion');

      return { minDate: true };
    }

    return null;
  }

  maxDateValidator(fecha_inicio: string, fecha_fin: string) {
    let mensaje = '';
    console.log('max.date');

    return (formGroup: FormGroup) => {
      const CONTROL = formGroup.controls[fecha_inicio];
      const CONTROL2 = formGroup.controls[fecha_fin];
      if (CONTROL.value === null || CONTROL2.value === null) {
        return;
      }
      const fecha_inicio2 = moment(CONTROL.value, 'YYYY/MM/DD');
      const fecha_fin2 = moment(CONTROL2.value, 'YYYY/MM/DD');

      if (!fecha_inicio2.isValid() || !fecha_fin2.isValid()) {
        return;
      }
      const fecha_actual = fecha_inicio2;
      let diferencia = 0;
      while (fecha_actual.isSameOrBefore(fecha_fin2)) {
        if (fecha_actual.day() !== 0 && fecha_actual.day() !== 6) {
          // Si no es domingo (0) ni sábado (6), cuenta como día laborable
          // Además, verifica si la fecha actual está en la lista de días festivos
          const fechaActualString = fecha_actual.format('YYYY-MM-DD');
          if (!this.dias_festivos.includes(fechaActualString)) {
            diferencia++;
          } else {
            console.log('Día feriado');
          }
        }
        fecha_actual.add(1, 'days'); // Avanza un día
      }
      console.log(diferencia);

      if (diferencia > this.saldo_vacacional.dias_disponibles) {
        console.log('Demasiados días');

        return { maxDate: true };
      }
      return null;
    };
  }

  allowedDateValidator(control: AbstractControl) {
    const fecha = moment(new Date(control.value), 'YYYY-MM-DD');
    const hoy = moment(new Date(), 'YYYY-MM-DD');
    if (hoy.year() + 1 === fecha.year()) {
      if (hoy.month() != 12 || (hoy.date() <= 16 && hoy.month() === 12)) {
        return { allowedDate: true };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  rangeDateValidator(fecha_inicio: string, fecha_fin: string) {
    let mensaje = '';
    console.log('max.date');

    return (formGroup: FormGroup) => {
      const CONTROL = formGroup.controls[fecha_inicio];
      const CONTROL2 = formGroup.controls[fecha_fin];
      if (CONTROL.value === null || CONTROL2.value === null) {
        return;
      }
      const fecha_inicio2 = moment(CONTROL.value, 'YYYY/MM/DD');
      const fecha_fin2 = moment(CONTROL2.value, 'YYYY/MM/DD');

      if (!fecha_inicio2.isValid() || !fecha_fin2.isValid()) {
        return;
      }

      if (fecha_inicio2 && fecha_fin2 && fecha_inicio2 > fecha_fin2) {
        return { dateRange: true };
      }
      return null;
    };
  }

  get fechaInicioNoValida(): string {
    this.mensaje = '';
    if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['minDate'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'La solicitud debe hacerse 2 semanas posterior a la fecha de hoy';
    } else if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['allowedDate'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'Aún no puedes hacer una solicitud para el año siguiente';
    }
    return this.mensaje;
  }

  get fechaFinNoValida(): string {
    this.mensaje = '';
    if (
      this.solicitud_formulario.get('fecha_fin')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (
      this.solicitud_formulario.errors?.['maxDate'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'Los días de la solicitud sobrepasan sus días disponibles';
    }
    else if (
      this.solicitud_formulario.errors?.['dateRange'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'La fecha de fin debe ser posterior a la de incio';
    }
    return this.mensaje;
  }

  get justificacionNoValida(){
    this.mensaje='';
    if (
      this.solicitud_formulario.get('justificacion')?.invalid
    ) {
      return true;
  }
  else{
    return false;
  }
}

}
