import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empresa } from 'src/app/interfaces/empresa.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
})
export class DepartamentosComponent implements OnInit{
  paginas = 0;
  paginasArray: number[]=[];
  departamentos: Departamento[] = [];
  departamento: Departamento = {
    nombre: '',
    empresa:{
      id:1,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
    }
  };
  pagina_actual = 0;
constructor(private adminService: AdminService) {}

 ngOnInit(): void {
  this.getDepartamentos(1);
 }

 getDepartamentos(page: number){
  this.pagina_actual=page;
  this.adminService.getDepartamentos(5, page)
  .subscribe({
    next: (res:{ departamentos: Departamento[], pages:number})=> {
      this.departamentos=res.departamentos;   
      this.paginas = res.pages;
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);     
    },
    error: (e: string)=> {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: e,
        confirmButtonColor:'#198754'
      })
    }
  })
}

 async guardarDepartamento() {
  const specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const { value: departamento } = await Swal.fire({//ingresa el nombre del departamento
    title: 'Ingrese Departamento',
    input: 'text',
    inputLabel: 'Nombre',
    inputPlaceholder: 'Ingrese Nombre del Departamento',
    confirmButtonColor:'#198754',
  });
  if(departamento && !(specialCharactersRegex.test(departamento))){//verifica si existe un dea
    let result=true
    console.log('this.departamentos',this.departamentos);
    
    if(this.departamentos.length !==0 ){
      console.log('antes de for');
    for (let i = 0; i < this.departamentos.length; i++) {
      console.log('entra al for');
      
      if(departamento.toLowerCase() === this.departamentos[i].nombre){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No puedes registrar dos Departamentos con el mismo nombre',
          confirmButtonColor:'#198754',
        })
        result=false;
        break;
      } 
      }
      if(result){
        this.adminService.getEmpresa()
        .subscribe({
          next: (res:Empresa)=> {
            this.departamento.empresa=res;
            this.departamento.nombre=departamento.toLowerCase();
            this.adminService.createDepartamento(this.departamento)
            .subscribe({
              next: (res: Departamento)=> {
                Swal.fire(`Departamento Registrado: ${departamento}`)
                setTimeout(function(){
                  window.location.reload();
               }, 2000); //recargo la página después de 2 segundos
              }
            })
          }
        })
      }
  }
}}

borrarDepartamento(id: number | undefined){
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Los datos no son reversibles",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#8c0b0a',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      if(id){
        this.adminService.deleteDepartamento(id)
        .subscribe({
         next: (res: Boolean)=>{
           if(res){
           Swal.fire({
             icon: 'success',
             title: 'Éxito',
             text: 'El departamento ha sido borrado con éxito',
             confirmButtonColor:'#198754',
           }),
           setTimeout(function(){
            window.location.reload();
         }, 2000); //recargo la página después de 2 segundos
         }
         else{
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'No se ha podido eliminar el departamento',
             confirmButtonColor:'#198754'
           })
         }
         },
         error: (err)=> {
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'No se ha podido eliminar el departamento',
             confirmButtonColor:'#198754'
           }), 
           console.log(err);
           
         },
        })
       }
    }
  })
}

}
